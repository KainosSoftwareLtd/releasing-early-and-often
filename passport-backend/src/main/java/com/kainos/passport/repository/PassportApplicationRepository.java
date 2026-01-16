package com.kainos.passport.repository;

import com.kainos.passport.entity.PassportApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PassportApplicationRepository extends JpaRepository<PassportApplication, UUID> {
}