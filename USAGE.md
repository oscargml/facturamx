# Cómo usar FacturaMX

FacturaMX te permite generar facturas CFDI 4.0 directamente desde WhatsApp. Sigue estos pasos para configurar y usar la aplicación.

## 1. Configuración Inicial (Administrador)

### Requisitos Previos
- Una cuenta en [Facturapi](https://www.facturapi.io) (puedes empezar en modo Sandbox).
- Una cuenta de desarrollador en [Meta for Developers](https://developers.facebook.com) con el producto WhatsApp configurado.
- Una base de datos PostgreSQL.

### Variables de Entorno
Configura las siguientes variables en tu archivo `.env` o en el panel de Vercel:
```env
DATABASE_URL="tu_url_de_postgresql"
FACTURAPI_KEY="tu_api_key_de_facturapi"
WHATSAPP_PHONE_ID="tu_phone_number_id"
WHATSAPP_ACCESS_TOKEN="tu_system_user_access_token"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="una_cadena_secreta_para_verificar"
```

### Inicialización de Datos
Debes crear al menos una "Organización" en la base de datos para que el sistema sepa qué llaves usar. Puedes hacerlo manualmente o mediante un script de seed.

## 2. Configuración del Webhook en Meta

1. Ve a tu aplicación en **Meta for Developers**.
2. En el menú de WhatsApp, selecciona **Configuración**.
3. En la sección de **Webhooks**, haz clic en **Editar**.
4. URL de devolución de llamada: `https://tu-dominio.com/api/webhook/messaging`
5. Token de verificación: El valor que pusiste en `WHATSAPP_WEBHOOK_VERIFY_TOKEN`.
6. En **Campos del webhook**, suscríbete al campo `messages`.

## 3. Uso del Bot de WhatsApp (Usuario)

1. **Inicia una conversación**: Envía un "Hola" o cualquier mensaje al número de WhatsApp configurado.
2. **Proporciona el RFC**: El bot te pedirá el RFC del cliente a facturar.
3. **Confirma el Cliente**: El bot buscará el RFC en Facturapi y te pedirá confirmar el nombre legal del cliente.
4. **Ingresa el Monto**: Escribe el monto total de la venta (ej. `500`).
5. **Confirma la Factura**: El bot te mostrará un resumen. Selecciona "Sí, generar".
6. **Descarga**: Una vez generada, el bot te enviará los enlaces para descargar el **PDF** y el **XML**.

## 4. Gestión en el Dashboard

Visita la ruta `/dashboard` en tu navegador para:
- Ver la lista de facturas generadas.
- Consultar los enlaces de descarga de facturas pasadas.
- Verificar si tus integraciones de API están configuradas correctamente.
