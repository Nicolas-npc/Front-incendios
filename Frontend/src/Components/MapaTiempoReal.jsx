import { useEffect, useMemo, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'


const CUSTOM_STYLE = 'mapbox://styles/nico-sxchez/cmngv8iz9001h01qw0e5fe0lo'
const EARTH_RADIUS_KM = 6371
const FIRE_DANGER_BASE_KM = 0.8

function getTodayISO() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const TODAY = getTodayISO()

const INITIAL_INCIDENTS = [
  { id: 1, title: 'Incendio T1 Publico', level: 'critico', type: 'incendio', date: TODAY, radiusKm: 4, coordinates: [-70.68, -33.43] },
  { id: 2, title: 'Brigada 02', level: 'medio', type: 'brigada', status: 'activo', date: TODAY, coordinates: [-70.64, -33.49] },
  { id: 4, title: 'Brigada de Marcha', level: 'bajo', type: 'brigada', status: 'inactivo', date: TODAY, coordinates: [-70.56, -33.47] },
]

const levelColor = {
  critico: '#dc2626',
  alto: '#f97316',
  medio: '#eab308',
  bajo: '#16a34a',
}

function getIncidentColor(item) {
  if (item.type === 'brigada') {
    return item.status === 'inactivo' ? '#6b7280' : '#2563eb'
  }

  return levelColor[item.level]
}

function getFeatureCollection(items) {
  return {
    type: 'FeatureCollection',
    features: items.map((item) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: item.coordinates },
      properties: {
        id: String(item.id),
        type: item.type,
        title: item.title,
        status: item.status || '',
        level: item.level,
        color: getIncidentColor(item),
      },
    })),
  }
}

function createCirclePolygon([lng, lat], radiusKm, points = 48) {
  const latRad = (lat * Math.PI) / 180
  const lngRad = (lng * Math.PI) / 180
  const angularDistance = radiusKm / EARTH_RADIUS_KM
  const coordinates = []

  for (let i = 0; i <= points; i += 1) {
    const bearing = (2 * Math.PI * i) / points
    const sinLat = Math.sin(latRad)
    const cosLat = Math.cos(latRad)
    const sinAd = Math.sin(angularDistance)
    const cosAd = Math.cos(angularDistance)

    const pointLat = Math.asin(sinLat * cosAd + cosLat * sinAd * Math.cos(bearing))
    const pointLng =
      lngRad +
      Math.atan2(
        Math.sin(bearing) * sinAd * cosLat,
        cosAd - sinLat * Math.sin(pointLat),
      )

    coordinates.push([(pointLng * 180) / Math.PI, (pointLat * 180) / Math.PI])
  }

  return coordinates
}

function getZonesFeatureCollection(items) {
  return {
    type: 'FeatureCollection',
    features: items
      .filter((item) => item.type === 'zona')
      .map((item) => ({
        type: 'Feature',
        properties: {
          id: String(item.id),
          title: item.title,
          radiusKm: item.radiusKm || 5,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [createCirclePolygon(item.coordinates, item.radiusKm || 5)],
        },
      })),
  }
}

function getFireZonesFeatureCollection(items) {
  return {
    type: 'FeatureCollection',
    features: items
      .filter((item) => item.type === 'incendio')
      .map((item) => ({
        type: 'Feature',
        properties: {
          id: String(item.id),
          title: item.title,
          radiusKm: item.radiusKm || 3,
          effectiveRadiusKm: (item.radiusKm || 3) + FIRE_DANGER_BASE_KM,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [createCirclePolygon(item.coordinates, (item.radiusKm || 3) + FIRE_DANGER_BASE_KM)],
        },
      })),
  }
}

export default function MapaTiempoReal() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const nextIncidentIdRef = useRef(INITIAL_INCIDENTS.length + 1)

  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS)
  const [isAddingFire, setIsAddingFire] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [newIncidentType, setNewIncidentType] = useState('incendio')
  const [newFireLevel, setNewFireLevel] = useState('alto')
  const [newBrigadaStatus, setNewBrigadaStatus] = useState('activo')
  const [mapReady, setMapReady] = useState(false)
  const [showIncendios, setShowIncendios] = useState(true)
  const [showBrigadas, setShowBrigadas] = useState(true)
  const [showZonas, setShowZonas] = useState(true)
  const [selectedDate, setSelectedDate] = useState(TODAY)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const [editingIncidentId, setEditingIncidentId] = useState(null)
  const [editingIncidentType, setEditingIncidentType] = useState('incendio')
  const [editingForm, setEditingForm] = useState({ title: '', level: 'alto', date: TODAY, radiusKm: 5 })

  const filteredIncidents = useMemo(() => {
    return incidents.filter((item) => {
      if (selectedDate && item.date !== selectedDate) return false
      if (item.type === 'incendio' && !showIncendios) return false
      if (item.type === 'brigada' && !showBrigadas) return false
      if (item.type === 'zona' && !showZonas) return false
      return true
    })
  }, [incidents, selectedDate, showIncendios, showBrigadas, showZonas])

  const totalIncendiosHoy = useMemo(() => {
    return incidents.filter((item) => item.type === 'incendio' && item.date === selectedDate).length
  }, [incidents, selectedDate])

  const totalBrigadasActivas = useMemo(() => {
    return incidents.filter(
      (item) => item.type === 'brigada' && item.status === 'activo' && item.date === selectedDate,
    ).length
  }, [incidents, selectedDate])

  const totalZonas = useMemo(() => {
    return incidents.filter(
      (item) => (item.type === 'zona' || item.type === 'incendio') && item.date === selectedDate,
    ).length
  }, [incidents, selectedDate])

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || FALLBACK_TOKEN

    if (!mapContainerRef.current || mapRef.current) return undefined

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: CUSTOM_STYLE,
      center: [-70.64, -33.45],
      zoom: 10.5,
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')

    map.on('load', () => {
      map.addSource('incendios-areas', {
        type: 'geojson',
        data: getFireZonesFeatureCollection(filteredIncidents),
      })

      map.addLayer({
        id: 'incendios-areas-fill',
        type: 'fill',
        source: 'incendios-areas',
        paint: {
          'fill-color': '#ef4444',
          'fill-opacity': 0.18,
        },
      })

      map.addLayer({
        id: 'incendios-areas-line',
        type: 'line',
        source: 'incendios-areas',
        paint: {
          'line-color': '#dc2626',
          'line-width': 2,
        },
      })

      map.addSource('eventos', {
        type: 'geojson',
        data: getFeatureCollection(filteredIncidents),
      })

      map.addSource('zonas-areas', {
        type: 'geojson',
        data: getZonesFeatureCollection(filteredIncidents),
      })

      map.addLayer({
        id: 'zonas-areas-fill',
        type: 'fill',
        source: 'zonas-areas',
        paint: {
          'fill-color': '#f97316',
          'fill-opacity': 0.2,
        },
      })

      map.addLayer({
        id: 'zonas-areas-line',
        type: 'line',
        source: 'zonas-areas',
        paint: {
          'line-color': '#fb923c',
          'line-width': 2,
        },
      })

      map.addLayer({
        id: 'eventos-circulos',
        type: 'circle',
        source: 'eventos',
        paint: {
          'circle-radius': [
            'match',
            ['get', 'type'],
            'incendio',
            12,
            10,
          ],
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      })

      map.addLayer({
        id: 'eventos-labels',
        type: 'symbol',
        source: 'eventos',
        layout: {
          'text-field': ['get', 'title'],
          'text-size': 11,
          'text-offset': [0, 1.2],
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#111827',
          'text-halo-width': 1,
        },
      })

      setMapReady(true)
    })

    mapRef.current = map

    return () => {
      setMapReady(false)
      map.remove()
      mapRef.current = null
    }
  }, [filteredIncidents])

  useEffect(() => {
    const source = mapRef.current?.getSource('eventos')
    if (source && 'setData' in source) {
      source.setData(getFeatureCollection(filteredIncidents))
    }

    const zonesSource = mapRef.current?.getSource('zonas-areas')
    if (zonesSource && 'setData' in zonesSource) {
      zonesSource.setData(getZonesFeatureCollection(filteredIncidents))
    }

    const fireZonesSource = mapRef.current?.getSource('incendios-areas')
    if (fireZonesSource && 'setData' in fireZonesSource) {
      fireZonesSource.setData(getFireZonesFeatureCollection(filteredIncidents))
    }

    if (mapRef.current?.getLayer('zonas-areas-fill')) {
      mapRef.current.setLayoutProperty('zonas-areas-fill', 'visibility', showZonas ? 'visible' : 'none')
    }

    if (mapRef.current?.getLayer('zonas-areas-line')) {
      mapRef.current.setLayoutProperty('zonas-areas-line', 'visibility', showZonas ? 'visible' : 'none')
    }

    if (mapRef.current?.getLayer('incendios-areas-fill')) {
      mapRef.current.setLayoutProperty('incendios-areas-fill', 'visibility', showIncendios ? 'visible' : 'none')
    }

    if (mapRef.current?.getLayer('incendios-areas-line')) {
      mapRef.current.setLayoutProperty('incendios-areas-line', 'visibility', showIncendios ? 'visible' : 'none')
    }
  }, [filteredIncidents])

  useEffect(() => {
    if (!mapReady || !mapRef.current) {
      return undefined
    }

    const map = mapRef.current

    const handleMapClick = (event) => {
      if (isAddingFire) {
        const isAddingIncendio = newIncidentType === 'incendio'

        const newIncident = {
          id: nextIncidentIdRef.current,
          title: `${isAddingIncendio ? 'Incendio Nuevo' : 'Brigada Nueva'} ${nextIncidentIdRef.current}`,
          level: isAddingIncendio ? newFireLevel : 'medio',
          type: newIncidentType,
          status: newIncidentType === 'brigada' ? newBrigadaStatus : undefined,
          date: selectedDate,
          radiusKm: isAddingIncendio ? 3 : undefined,
          coordinates: [event.lngLat.lng, event.lngLat.lat],
        }

        nextIncidentIdRef.current += 1
        setIncidents((current) => [...current, newIncident])
        setLastUpdate(new Date())
        return
      }

      const features = map.queryRenderedFeatures(event.point, {
        layers: ['eventos-circulos', 'zonas-areas-fill'],
      })

      const editableFeature = features.find(
        (feature) =>
          feature.properties?.type === 'incendio' ||
          feature.properties?.type === 'brigada' ||
          feature.properties?.type === 'zona' ||
          (feature.layer && feature.layer.id === 'zonas-areas-fill'),
      )

      if (!editableFeature) {
        return
      }

      const incidentId = Number(editableFeature.properties.id)
      const incidentToEdit = incidents.find((item) => item.id === incidentId)

      if (!incidentToEdit) {
        return
      }

      setEditingIncidentId(incidentToEdit.id)
      setEditingIncidentType(incidentToEdit.type)
      setEditingForm({
        title: incidentToEdit.title,
        level: incidentToEdit.level,
        date: incidentToEdit.date,
        status: incidentToEdit.status || 'activo',
        radiusKm: incidentToEdit.radiusKm || 5,
      })
      setIsSidebarOpen(true)
    }

    map.on('click', handleMapClick)

    return () => {
      map.off('click', handleMapClick)
    }
  }, [incidents, isAddingFire, mapReady, newBrigadaStatus, newFireLevel, newIncidentType, selectedDate])

  useEffect(() => {
    if (!mapReady || !mapRef.current) {
      return
    }

    mapRef.current.getCanvas().style.cursor = isAddingFire ? 'crosshair' : ''
  }, [isAddingFire, mapReady])

  const handleSaveIncident = () => {
    if (!editingIncidentId) {
      return
    }

    setIncidents((current) =>
      current.map((item) => {
        if (item.id !== editingIncidentId) {
          return item
        }

        return {
          ...item,
          title: editingForm.title.trim() || item.title,
          level: editingForm.level,
          date: editingForm.date || item.date,
          status: item.type === 'brigada' ? editingForm.status : item.status,
          radiusKm:
            item.type === 'zona' || item.type === 'incendio'
              ? Math.min(20, Math.max(1, Number(editingForm.radiusKm) || 1))
              : item.radiusKm,
        }
      }),
    )

    setLastUpdate(new Date())
    setEditingIncidentId(null)
    setEditingIncidentType('incendio')
  }

  const handleDeleteIncident = () => {
    if (!editingIncidentId) {
      return
    }

    setIncidents((current) => current.filter((item) => item.id !== editingIncidentId))
    setLastUpdate(new Date())
    setEditingIncidentId(null)
    setEditingIncidentType('incendio')
  }

  return (
    <section className="bg-[#0f172a] px-2 pb-2 sm:px-4 sm:pb-4">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-xl border border-black/20 shadow-xl">
        <div ref={mapContainerRef} className="h-[78vh] min-h-140 w-full" />

        <button
          type="button"
          className="absolute left-3 top-3 z-20 rounded-md bg-[#0f4b8f] px-3 py-2 text-xs font-semibold text-white shadow hover:bg-[#0c3d74]"
          onClick={() => setIsSidebarOpen((current) => !current)}
        >
          {isSidebarOpen ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>

        <aside
          className={`absolute left-3 top-14 z-10 max-h-[calc(78vh-4.5rem)] w-64 overflow-y-auto rounded-lg bg-white/95 p-4 shadow-lg backdrop-blur-sm transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'
          }`}
        >
          <h3 className="mb-3 text-lg font-bold text-slate-800">Filtros</h3>
          <p className="text-sm font-semibold text-slate-700">Agregar elemento</p>
          <select
            value={newIncidentType}
            onChange={(event) => setNewIncidentType(event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700"
          >
            <option value="incendio">Incendio</option>
            <option value="brigada">Brigada</option>
          </select>
          <button
            type="button"
            className={`mt-2 w-full rounded-md py-2 text-sm font-semibold text-white ${
              isAddingFire ? 'bg-[#dc2626] hover:bg-[#b91c1c]' : 'bg-[#0f4b8f] hover:bg-[#0c3d74]'
            }`}
            onClick={() => setIsAddingFire((current) => !current)}
          >
            {isAddingFire ? `Modo agregar ${newIncidentType} activo (clic en mapa)` : `Activar modo agregar ${newIncidentType}`}
          </button>

          {newIncidentType === 'incendio' ? (
            <select
              value={newFireLevel}
              onChange={(event) => setNewFireLevel(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700"
            >
              <option value="critico">Nivel Critico</option>
              <option value="alto">Nivel Alto</option>
              <option value="medio">Nivel Medio</option>
              <option value="bajo">Nivel Bajo</option>
            </select>
          ) : (
            <select
              value={newBrigadaStatus}
              onChange={(event) => setNewBrigadaStatus(event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700"
            >
              <option value="activo">Estado: Activo</option>
              <option value="inactivo">Estado: Inactivo</option>
            </select>
          )}

          <p className="mt-3 text-sm font-semibold text-slate-700">Fecha</p>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700"
          />

          <p className="mt-3 text-sm font-semibold text-slate-700">Tipo de Incidente</p>
          <label className="mt-2 flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={showIncendios} onChange={(e) => setShowIncendios(e.target.checked)} />
            Incendios Activos
          </label>
          <label className="mt-1 flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={showBrigadas} onChange={(e) => setShowBrigadas(e.target.checked)} />
            Brigadas
          </label>

          <p className="mt-4 text-sm font-semibold text-slate-700">Nivel de Riesgo</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#dc2626]" /> Critico</li>
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#f97316]" /> Alto</li>
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#eab308]" /> Medio</li>
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-[#16a34a]" /> Bajo</li>
          </ul>
        </aside>

        {editingIncidentId ? (
          <div className="absolute right-3 top-3 z-20 w-72 rounded-lg bg-white p-4 shadow-xl">
            <p className="text-sm font-bold text-slate-800">
                {editingIncidentType === 'zona'
                  ? 'Editar zona de peligro'
                  : editingIncidentType === 'brigada'
                    ? 'Editar brigada'
                    : 'Editar incendio'}
            </p>
            <p className="mt-1 text-xs text-slate-500">ID: {editingIncidentId}</p>

              {editingIncidentType === 'brigada' ? (
              <>
                <label className="mt-3 block text-xs font-semibold text-slate-700">Nombre</label>
                <input
                  type="text"
                  value={editingForm.title}
                  onChange={(event) => setEditingForm((current) => ({ ...current, title: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700"
                />

                <label className="mt-3 block text-xs font-semibold text-slate-700">Estado</label>
                <select
                  value={editingForm.status}
                  onChange={(event) => setEditingForm((current) => ({ ...current, status: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </>
            ) : (
              <>
                <label className="mt-3 block text-xs font-semibold text-slate-700">Nombre</label>
                <input
                  type="text"
                  value={editingForm.title}
                  onChange={(event) => setEditingForm((current) => ({ ...current, title: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700"
                />

                <label className="mt-3 block text-xs font-semibold text-slate-700">Nivel</label>
                <select
                  value={editingForm.level}
                  onChange={(event) => setEditingForm((current) => ({ ...current, level: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700"
                >
                  <option value="critico">Critico</option>
                  <option value="alto">Alto</option>
                  <option value="medio">Medio</option>
                  <option value="bajo">Bajo</option>
                </select>

                <label className="mt-3 block text-xs font-semibold text-slate-700">Fecha</label>
                <input
                  type="date"
                  value={editingForm.date}
                  onChange={(event) => setEditingForm((current) => ({ ...current, date: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700"
                />

                {editingIncidentType === 'zona' || editingIncidentType === 'incendio' ? (
                  <>
                <label className="mt-3 block text-xs font-semibold text-slate-700">
                  {editingIncidentType === 'zona' ? 'Tamano zona (km)' : 'Zona de peligro incendio (km)'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={editingForm.radiusKm}
                  onChange={(event) =>
                    setEditingForm((current) => ({
                      ...current,
                      radiusKm: Math.min(20, Math.max(1, Number(event.target.value) || 1)),
                    }))
                  }
                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-700"
                />
                  </>
                ) : null}
              </>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleSaveIncident}
                className="rounded-md bg-[#0f4b8f] py-2 text-xs font-semibold text-white hover:bg-[#0c3d74]"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingIncidentId(null)
                  setEditingIncidentType('incendio')
                }}
                className="rounded-md bg-slate-500 py-2 text-xs font-semibold text-white hover:bg-slate-600"
              >
                Cerrar
              </button>
            </div>

            <button
              type="button"
              onClick={handleDeleteIncident}
              className="mt-2 w-full rounded-md bg-[#dc2626] py-2 text-xs font-semibold text-white hover:bg-[#b91c1c]"
            >
              {editingIncidentType === 'zona'
                ? 'Eliminar zona de peligro'
                : editingIncidentType === 'brigada'
                  ? 'Eliminar brigada'
                  : 'Eliminar incendio'}
            </button>
          </div>
        ) : null}

        <div className="absolute bottom-4 left-1/2 z-10 grid w-[90%] -translate-x-1/2 grid-cols-3 gap-3 sm:w-auto sm:min-w-140">
          <div className="rounded-lg bg-white px-5 py-3 text-center shadow-lg">
            <p className="text-3xl font-bold text-[#dc2626]">{totalIncendiosHoy}</p>
            <p className="text-sm text-slate-700">Incendios Hoy</p>
          </div>
          <div className="rounded-lg bg-white px-5 py-3 text-center shadow-lg">
            <p className="text-3xl font-bold text-[#0f4b8f]">{totalBrigadasActivas}</p>
            <p className="text-sm text-slate-700">Brigadas Activas</p>
          </div>
          <div className="rounded-lg bg-white px-5 py-3 text-center shadow-lg">
            <p className="text-3xl font-bold text-[#ca8a04]">{totalZonas}</p>
            <p className="text-sm text-slate-700">Zonas de Riesgo</p>
          </div>
        </div>

        <div className="absolute bottom-4 right-3 z-10 w-44 rounded-lg bg-white/95 p-3 text-xs text-slate-700 shadow-lg">
          <p className="mb-2 font-bold">Leyenda</p>
          <p>Incendio Activo</p>
          <p>Brigada</p>
          <p>Zona de Riesgo</p>
          <p className="mt-2 text-[11px] text-slate-500">Actualizado: {lastUpdate.toLocaleTimeString('es-CL')}</p>
        </div>
      </div>
    </section>
  )
}
