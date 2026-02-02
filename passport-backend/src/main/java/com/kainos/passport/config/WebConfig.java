package com.kainos.passport.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.method.HandlerTypePredicate;
import org.springframework.web.servlet.config.annotation.ApiVersionConfigurer;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void configureApiVersioning(ApiVersionConfigurer configurer) {
        // Choose ONE of these approaches (they cannot be mixed)
            //.usePathSegment(1)                                                // Path-based: /api/v1/users
            //.useQueryParam("version")                                         // Query parameter-based
            //.useMediaTypeParameter(MediaType.APPLICATION_JSON, "version");    // Media type
        configurer.useRequestHeader("X-API-Version");                           // Header-based -> Our selected approach
        configurer.addSupportedVersions("1.0", "2.0");
        configurer.setDefaultVersion("1.0");
        configurer.setVersionParser(new ApiVersionParser());
	}

	@Override
	public void configurePathMatch(PathMatchConfigurer configurer) {
		configurer.addPathPrefix("/api",
			HandlerTypePredicate.forAnnotation(RestController.class)
				.and(HandlerTypePredicate.forBasePackage("org.springdoc").negate())
				.and(c -> !c.getPackageName().contains("springdoc"))
				.and(c -> !c.getName().contains("OpenApi")));
	}

}