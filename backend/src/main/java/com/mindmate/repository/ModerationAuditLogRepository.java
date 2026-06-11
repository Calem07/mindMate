package com.mindmate.repository;

import com.mindmate.domain.ModerationAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModerationAuditLogRepository extends JpaRepository<ModerationAuditLog, Long> {}
