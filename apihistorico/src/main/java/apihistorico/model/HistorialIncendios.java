package apihistorico.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Historial de Incendios")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HistorialIncendios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El id de reporte no puede estar vacio")
    private Long idReporteOrigen;

    @NotBlank(message = "El tipo de Incendio no puede quedar vacio")
    private String tipoIncendio;

    @NotNull(message = "La latitud no puede quedar vacia")
    private double latitud;

    @NotNull(message = "La longitud no puede quedar nula")
    private double longitud;

    @NotNull(message = "Debe ingresar la fecha y hora del incidente")
    @PastOrPresent(message = "La hora no puede ser futura")
    private LocalDateTime fechaInicio;

    @NotNull(message = "Debe ingresar la fecha y hora del final del incendios")
    @PastOrPresent(message = "La hora y fecha no puede ser futura")
    private LocalDateTime fechaCierre;

    @NotNull(message = "Se debe ingresar un area afectada")
    private double areaAfectada;

    @NotBlank(message = "el nivel de gravedad es obligatorio")
    private String nivelGravedad;
}
