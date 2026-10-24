package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.docker.entity.InteriorDesign;
import com.klef.soa.docker.service.InteriorDesignSerive;



@RestController
@CrossOrigin(origins = "*")
public class InterioirDesignController 
{
	@Autowired
	private InteriorDesignSerive interiordesign;
	
	@GetMapping("/")
	public String demo()
	{
		return "CRUD Service is running";
	}
	
	@PostMapping("/add")
	public ResponseEntity<InteriorDesign> addInteriorDesign(@RequestBody InteriorDesign design)
	{
		 InteriorDesign d = interiordesign.addInteriorDesign(design);
		 return ResponseEntity.ok().body(d);
	}
	
	@GetMapping("/displayall")
	public ResponseEntity<List<InteriorDesign>> displayallInteriorDesigns() {
		 List<InteriorDesign> d = interiordesign.displayAllDesigns();
		return ResponseEntity.ok(d);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> deleteInteriordesignbyid(@PathVariable Long id)
	{
		String d = interiordesign.deleteDesignById(id);
		
		if ("Design Deleted Successfully".equals(d))
		{
			return ResponseEntity.ok(d);
		}
		else
		{
			return ResponseEntity.status(404).body("Design ID Not Found");
		}
	}
	
	
	@GetMapping("/display/{id}")
	public ResponseEntity<InteriorDesign> displayDesignById(@PathVariable Long id)
	{
		InteriorDesign design = interiordesign.displayDesginById(id);
		return ResponseEntity.ok(design);
	}
	
	@PutMapping("/update")
	public ResponseEntity<?> updateInteriorDesign(@RequestBody InteriorDesign design)
	{
		InteriorDesign d = interiordesign.updateInteriorDesign(design);
		
		if (d != null)
		{
			return ResponseEntity.ok(d);
		}
		else
		{
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Interior Design ID Not Found");
		}
	}
	
}
