package apihistorico.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import apihistorico.model.HistorialIncendios;

public interface HistorialRepository extends JpaRepository<HistorialIncendios, Long>{

}
