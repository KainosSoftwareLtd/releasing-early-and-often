package com.kainos.passport.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.parameters.Parameter;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.web.bind.annotation.RequestMapping;

import java.lang.reflect.Method;
import java.util.ArrayList;

@Configuration
public class SwaggerConfig {

    private static final String API_VERSION_HEADER_NAME = "X-API-Version";

    @Bean
    public OpenAPI passportApplicationOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("UK Passport Application API")
                        .description("REST API for managing UK passport applications")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Kainos Team"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }

    @Bean
    public GroupedOpenApi apiV1() {
        return GroupedOpenApi.builder()
                .group("v1.0")
                .pathsToMatch("/api/**")
                .addOpenApiMethodFilter(handlerMethod -> shouldIncludeInGroup(handlerMethod, "1.0"))
                .addOperationCustomizer((operation, handlerMethod) -> {
                    upsertApiVersionHeader(operation, "API version (defaults to 1.0)", "1.0", false);
                    return operation;
                })
                .build();
    }

    @Bean
    public GroupedOpenApi apiV2() {
        return GroupedOpenApi.builder()
                .group("v2.0")
                .pathsToMatch("/api/**")
                .addOpenApiMethodFilter(handlerMethod -> shouldIncludeInGroup(handlerMethod, "2.0"))
                .addOperationCustomizer((operation, handlerMethod) -> {
                    upsertApiVersionHeader(operation, "API version (must be 2.0)", "2.0", true);
                    return operation;
                })
                .build();
    }

    private static boolean shouldIncludeInGroup(Method method, String groupVersion) {
        RequestMapping requestMapping = AnnotatedElementUtils.findMergedAnnotation(method, RequestMapping.class);
        if (requestMapping == null) {
            return true;
        }

        String version = requestMapping.version();
        if (version == null || version.isBlank()) {
            return true;
        }

        return groupVersion.equals(version);
    }

    private static void upsertApiVersionHeader(
            io.swagger.v3.oas.models.Operation operation,
            String description,
            String defaultValue,
            boolean required
    ) {
        if (operation.getParameters() == null) {
            operation.setParameters(new ArrayList<>());
        }

        Parameter existing = operation.getParameters().stream()
                .filter(p -> API_VERSION_HEADER_NAME.equalsIgnoreCase(p.getName()))
                .filter(p -> "header".equalsIgnoreCase(p.getIn()))
                .findFirst()
                .orElse(null);

        Parameter param = existing != null ? existing : new Parameter().in("header").name(API_VERSION_HEADER_NAME);
        param.setDescription(description);
        param.setRequired(required);

        StringSchema schema = new StringSchema();
        schema.setDefault(defaultValue);
        param.setSchema(schema);

        if (existing == null) {
            operation.getParameters().add(param);
        }
    }
}