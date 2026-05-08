package com.kainos.passport.repository;

import com.kainos.passport.dto.applicationV2.CreateApplicationRequestV2;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public class ParentDetailsStore {

    private final JdbcTemplate jdbcTemplate;

    public ParentDetailsStore(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(UUID applicationId, CreateApplicationRequestV2 request) {
        jdbcTemplate.update(
                """
                UPDATE passport_applications
                SET parent1_full_name = ?,
                    parent1_contact = ?,
                    parent2_full_name = ?,
                    parent2_contact = ?
                WHERE id = ?
                """,
                request.getParent1FullName(),
                request.getParent1Contact(),
                request.getParent2FullName(),
                request.getParent2Contact(),
                applicationId);
    }
}