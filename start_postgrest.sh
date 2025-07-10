#!/bin/bash

# Script básico para iniciar PostgREST
echo "Iniciando PostgREST..."

# Verificar si postgrest está instalado
if ! command -v postgrest &> /dev/null; then
    echo "PostgREST no está instalado. Instalando..."
    
    # Para macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install postgrest
    # Para Linux
    else
        echo "Por favor instala PostgREST manualmente desde: https://postgrest.org/en/stable/install.html"
        exit 1
    fi
fi

# Iniciar PostgREST con la configuración
postgrest postgrest.conf

echo "PostgREST iniciado en puerto 3001"
echo "API de logs disponible en: http://localhost:3001/app_logs"
echo "Vista de logs recientes: http://localhost:3001/recent_logs"
