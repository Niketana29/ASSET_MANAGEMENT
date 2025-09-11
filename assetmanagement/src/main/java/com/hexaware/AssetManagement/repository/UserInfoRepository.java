package com.hexaware.AssetManagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.AssetManagement.entities.UserInfo;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
	Optional<UserInfo> findByUsername(String username);

	boolean existsByUsername(String username);
}