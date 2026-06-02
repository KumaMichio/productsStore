package com.project.shopapp.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NewsletterDTO {
    @NotEmpty(message = "Email cannot be empty")
    @Email(message = "Email is not valid")
    private String email;
}
