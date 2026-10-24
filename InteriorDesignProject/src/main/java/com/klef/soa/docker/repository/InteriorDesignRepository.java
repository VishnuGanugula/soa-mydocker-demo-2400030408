package com.klef.soa.docker.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klef.soa.docker.entity.InteriorDesign;




@Repository
public interface InteriorDesignRepository extends JpaRepository<InteriorDesign, Long>
{
	
}
