package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.entity.InteriorDesign;



public interface InteriorDesignSerive 
{
	InteriorDesign addInteriorDesign(InteriorDesign design);
	List<InteriorDesign> displayAllDesigns();
	String deleteDesignById(Long id);
	InteriorDesign updateInteriorDesign(InteriorDesign design);
	InteriorDesign displayDesginById(Long id);
}
