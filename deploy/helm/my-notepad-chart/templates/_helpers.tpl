{{/*
Expand the name of the chart.
*/}}
{{- define "my-notepad-chart.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "my-notepad-chart.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "my-notepad-chart.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "my-notepad-chart.labels" -}}
helm.sh/chart: {{ include "my-notepad-chart.chart" . }}
{{ include "my-notepad-chart.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "my-notepad-chart.selectorLabels" -}}
app.kubernetes.io/name: {{ include "my-notepad-chart.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "my-notepad-chart.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "my-notepad-chart.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Frontend fullname
*/}}
{{- define "my-notepad-chart.frontendFullname" -}}
{{- printf "%s-%s" (include "my-notepad-chart.fullname" .) "frontend" }}
{{- end }}

{{/*
Backend fullname
*/}}
{{- define "my-notepad-chart.backendFullname" -}}
{{- printf "%s-%s" (include "my-notepad-chart.fullname" .) "backend" }}
{{- end }}

{{/*
Database host
*/}}
{{- define "my-notepad-chart.databaseHost" -}}
{{- printf "%s-%s" (include "my-notepad-chart.fullname" .) "database" }}
{{- end }}
