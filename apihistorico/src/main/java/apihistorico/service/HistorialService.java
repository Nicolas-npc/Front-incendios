package apihistorico.service;

import java.util.List;

import org.springframework.stereotype.Service;

import apihistorico.model.HistorialIncendios;
import apihistorico.repository.HistorialRepository;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class HistorialService {

    private final HistorialRepository repositorio;

    public List<HistorialIncendios> BuscarHistorial(){
        return repositorio.findAll();
    }

    

}
