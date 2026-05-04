package apiuser.model;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "Usuario")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Valid
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "el nombre no puede estar vacio")
    private String nombre;

    @NotBlank(message = "el apellido no puede estar vacio")
    private String apellido;

    @NotBlank
    @Pattern(regexp = "^[0-9]{7,8}-[0-9Kk]$|(?i)^[0-9]{1,2}\\.[0-9]{3}\\.[0-9]{3}-[0-9Kk]$", message = "Formato de rut invalido ej(12345678-9)")
    private String rut;

    @NotBlank(message = "El numero de telefono no puede estar vacio")
    private String telefono;

    @NotBlank(message = "el correo no puede estar vacio")
    @Email(message = "debe ingresar un formato de correo valido")
    private String correo;

    @NotBlank(message = "La contraseña no puede estar vacia")
    @Size(min = 8, message = "la contraseña debe tener al menos 8 caracteres")
    @Column(length = 60)
    private String password;
}