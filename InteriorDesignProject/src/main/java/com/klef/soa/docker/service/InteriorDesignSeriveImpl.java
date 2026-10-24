package com.klef.soa.docker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.docker.entity.InteriorDesign;
import com.klef.soa.docker.repository.InteriorDesignRepository;



@Service
public class InteriorDesignSeriveImpl implements InteriorDesignSerive
{
	
	@Autowired
	private InteriorDesignRepository designRepository;

	@Override
	public InteriorDesign addInteriorDesign(InteriorDesign design) {
		// TODO Auto-generated method stub
		return designRepository.save(design);
	}

	@Override
	public List<InteriorDesign> displayAllDesigns() {
		// TODO Auto-generated method stub
		return designRepository.findAll();
	}

	@Override
	public String deleteDesignById(Long id) {
		// TODO Auto-generated method stub
        boolean pres = designRepository.existsById(id);
		
		if (pres)
		{
			designRepository.deleteById(id);
			return "Design Deleted Successfully";
		}
		else
		{
			return "Design ID Not Found";
		}
	}

	@Override
	public InteriorDesign updateInteriorDesign(InteriorDesign design) {
		// TODO Auto-generated method stub
		
		Optional<InteriorDesign> optional = designRepository.findById(design.getId());
		if (optional.isPresent()) {
			InteriorDesign d = optional.get();
			d.setBudget(design.getBudget());
			d.setCompleted(design.getCompleted());
			
			return designRepository.save(d);
		}
		else {
			return null;
		}
	}

	@Override
	public InteriorDesign displayDesginById(Long id) {
		// TODO Auto-generated method stub
		return designRepository.findById(id).orElse(null);
	}

	
}
