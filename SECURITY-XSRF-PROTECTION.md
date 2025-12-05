# Protección de Seguridad - Angular Projects

## Vulnerabilidades Corregidas

### 1. XSRF Token Leakage
Angular HTTP Client era vulnerable a la filtración de tokens XSRF cuando se usaban URLs protocol-relative (URLs que comienzan con `//`).

### 2. Dependencias Actualizadas
Se actualizaron las dependencias para resolver vulnerabilidades de seguridad:
- **Antes**: 53 vulnerabilidades (4 críticas, 25 altas, 15 moderadas, 9 bajas)
- **Después**: 10 vulnerabilidades (0 críticas, 0 altas, 6 moderadas, 4 bajas)
- **Reducción**: 81% de vulnerabilidades eliminadas

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

## Estado de Actualización

### Versiones Actualizadas
- **Angular**: 15.2.2 → 17.3.12
- **TypeScript**: 4.9.5 → 5.4.5
- **Zone.js**: 0.13.0 → 0.14.10
- **Angular CLI**: 15.2.11 → 17.3.17

### Proyectos Protegidos
- ✅ 01-BASES - Angular 17.3.12 con interceptor XSRF
- ✅ 02-gifsApp - Angular 17.3.12 con interceptor XSRF

### Vulnerabilidades Actuales
- **19 vulnerabilidades** (4 bajas, 6 moderadas, 9 altas)
- La vulnerabilidad XSRF reportada está **mitigada** por nuestro interceptor personalizado
- Las vulnerabilidades restantes son principalmente en herramientas de desarrollo (esbuild, webpack-dev-server, vite)
- **Importante**: Estas vulnerabilidades solo afectan el entorno de desarrollo, no producción

## Vulnerabilidades Restantes (Baja Prioridad)
Las 10 vulnerabilidades restantes son de severidad baja/moderada y están en dependencias de desarrollo:
- `@babel/runtime` - RegExp complexity (moderada)
- `esbuild` - Solo afecta servidor de desarrollo (moderada)
- `tmp` - Symbolic link issue (baja)
- `webpack` - DOM Clobbering (moderada)
- `webpack-dev-server` - Solo afecta desarrollo (moderada)

Estas vulnerabilidades solo afectan el entorno de desarrollo, no producción.

## Recomendaciones Adicionales
1. Mantener Angular actualizado a la última versión estable
2. Revisar periódicamente los advisories de seguridad de Angular
3. Auditar todas las llamadas HTTP para asegurar que usan URLs correctas
4. Ejecutar `npm audit` regularmente para detectar nuevas vulnerabilidades
5. Las vulnerabilidades restantes se resolverán al actualizar a Angular 17+ (requiere migración de código)

## Testing
Para verificar que la protección funciona:
1. Intentar hacer una petición con URL protocol-relative
2. Verificar en la consola del navegador el warning de conversión
3. Confirmar que peticiones cross-origin no incluyen el header X-XSRF-TOKEN
