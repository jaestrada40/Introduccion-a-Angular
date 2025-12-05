# Protección contra Vulnerabilidad XSRF Token Leakage

## Vulnerabilidad Corregida
Angular HTTP Client era vulnerable a la filtración de tokens XSRF cuando se usaban URLs protocol-relative (URLs que comienzan con `//`).

## Soluciones Implementadas

### 1. Interceptor de Seguridad XSRF
Se ha creado `SafeXsrfInterceptor` en ambos proyectos que:

- **Detecta URLs protocol-relative**: Convierte automáticamente URLs como `//example.com/api` a URLs absolutas con protocolo explícito
- **Valida origen de peticiones**: Verifica si una petición es cross-origin
- **Remueve tokens en peticiones externas**: Elimina el header `X-XSRF-TOKEN` en peticiones cross-origin para prevenir filtración

### 2. Configuración HttpClientXsrfModule
Se ha configurado explícitamente la protección XSRF con:
```typescript
HttpClientXsrfModule.withOptions({
  cookieName: 'XSRF-TOKEN',
  headerName: 'X-XSRF-TOKEN'
})
```

### 3. Registro del Interceptor
El interceptor se registra globalmente en `app.module.ts`:
```typescript
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: SafeXsrfInterceptor,
    multi: true
  }
]
```

## Mejores Prácticas

### ✅ Hacer
- Usar URLs absolutas con protocolo explícito: `https://api.example.com/data`
- Usar URLs relativas para same-origin: `/api/data`
- Mantener el interceptor activo en todos los proyectos

### ❌ Evitar
- URLs protocol-relative: `//api.example.com/data`
- Enviar tokens XSRF a dominios externos
- Deshabilitar la protección XSRF sin razón válida

## Proyectos Protegidos
- ✅ 01-BASES
- ✅ 02-gifsApp

## Recomendaciones Adicionales
1. Mantener Angular actualizado a la última versión estable
2. Revisar periódicamente los advisories de seguridad de Angular
3. Auditar todas las llamadas HTTP para asegurar que usan URLs correctas
4. Considerar actualizar a Angular 16+ para obtener las últimas correcciones de seguridad

## Testing
Para verificar que la protección funciona:
1. Intentar hacer una petición con URL protocol-relative
2. Verificar en la consola del navegador el warning de conversión
3. Confirmar que peticiones cross-origin no incluyen el header X-XSRF-TOKEN
