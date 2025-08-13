package com.hexaware.assetapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class AssetRestApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(AssetRestApiApplication.class, args);
	}
	
	  @Bean
	    public RestTemplate getRestTemplate() {
	        return new RestTemplate();
	    }
	
	

}
