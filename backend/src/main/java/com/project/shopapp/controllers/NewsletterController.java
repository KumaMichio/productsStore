package com.project.shopapp.controllers;

import com.project.shopapp.dtos.NewsletterDTO;
import com.project.shopapp.responses.ResponseObject;
import com.project.shopapp.services.newsletter.NewsletterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/newsletter")
public class NewsletterController {
    private final NewsletterService newsletterService;

    @PostMapping("/subscribe")
    public ResponseEntity<ResponseObject> subscribe(
            @Valid @RequestBody NewsletterDTO newsletterDTO,
            BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(ResponseObject.builder()
                    .message(errorMessages.toString())
                    .status(HttpStatus.BAD_REQUEST)
                    .data(null)
                    .build());
        }
        boolean added = newsletterService.subscribe(newsletterDTO);
        return ResponseEntity.ok(ResponseObject.builder()
                .message(added ? "Đăng ký nhận tin thành công" : "Email này đã đăng ký trước đó")
                .status(HttpStatus.OK)
                .data(null)
                .build());
    }
}
