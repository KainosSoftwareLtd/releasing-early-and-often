package com.kainos.passport.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "passport_applications")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = {"createdAt", "updatedAt"})
public class PassportApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Application data fields
    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @Column(name = "previous_passport")
    private String previousPassport;

    @Column(name = "address_line_1")
    private String addressLine1;

    @Column(name = "address_line_2")
    private String addressLine2;

    @Column(name = "town_city")
    private String townCity;

    @Column(name = "postcode")
    private String postcode;

    public enum ApplicationStatus {
        IN_PROGRESS,
        SUBMITTED,
        COMPLETED
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    // Parent details (v2 API fields)
    @Column(name = "parent1_full_name")
    private String parent1FullName;

    @Column(name = "parent1_contact")
    private String parent1Contact;

    @Column(name = "parent2_full_name")
    private String parent2FullName;

    @Column(name = "parent2_contact")
    private String parent2Contact;
}