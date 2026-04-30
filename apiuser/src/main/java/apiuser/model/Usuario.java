package apiuser.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private String password;
}
