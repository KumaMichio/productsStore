package com.project.shopapp.controllers;

import com.project.shopapp.dtos.ContactMessageDTO;
import com.project.shopapp.models.ContactMessage;
import com.project.shopapp.responses.ResponseObject;
import com.project.shopapp.services.contact.ContactService;
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
@RequestMapping("${api.prefix}/contacts")
public class ContactController {
    private final ContactService contactService;

    @PostMapping("")
    public ResponseEntity<ResponseObject> createContactMessage(
            @Valid @RequestBody ContactMessageDTO contactMessageDTO,
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
        ContactMessage contactMessage = contactService.createContactMessage(contactMessageDTO);
        return ResponseEntity.ok(ResponseObject.builder()
                .message("Gửi liên hệ thành công")
                .status(HttpStatus.OK)
                .data(contactMessage)
                .build());
    }
}
