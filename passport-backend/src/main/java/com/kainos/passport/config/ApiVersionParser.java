package com.kainos.passport.config;

public class ApiVersionParser implements org.springframework.web.accept.ApiVersionParser {

    @Override
    public Comparable parseVersion(String version) {

		if("api-docs".equals(version) || "index.html".equals(version)
				|| "swagger-ui-bundle.js".equals(version)
				|| "swagger-ui.css".equals(version)
				|| "index.css".equals(version)
				|| "swagger-ui-standalone-preset.js".equals(version)
				|| "favicon-32x32.png".equals(version)
				|| "favicon-16x16.png".equals(version)
				|| "swagger-initializer.js".equals(version))
			return null;
        return version;
    }
}
