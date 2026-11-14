# 🛠️ Cheat Sheet Maestro — Etapa 1 (Modo Sin Agentes)

**Ingeniero:** Ander (UNSA)  
**Propósito:** Diccionario de referencia rápida de comandos, banderas y bloques de configuración para escribir infraestructura desde cero sin depender de autocompletado de IA.

---

## 🐧 1. LINUX — FASE 1: Archivos, Usuarios, Permisos y Flujos I/O

### 1.1 Estructura FHS (Rutas Clave del Sistema)
* `/etc` : Archivos de configuración global del sistema y servicios (ej. `/etc/nginx`, `/etc/ssh`).
* `/var` : Datos variables, logs del sistema (`/var/log`) y volúmenes de Docker (`/var/lib/docker`).
* `/home` : Directorios personales de cada usuario estándar.
* `/usr` : Binarios y librerías de usuario (`/usr/bin`, `/usr/local`).
* `/tmp` : Archivos temporales (se borran al reiniciar).

### 1.2 Navegación y Manipulación de Archivos
* `pwd` : Muestra la ruta absoluta del directorio actual.
* `cd <ruta>` : Cambia de directorio.
  * `cd ..` (sube un nivel), `cd ~` (va a tu carpeta `/home`), `cd -` (vuelve a la carpeta anterior).
* `ls` : Lista el contenido de un directorio.
  * `-l` (lista detallada con permisos/dueños), `-a` (incluye ocultos `.env`), `-h` (tamaños legibles KB/MB/GB).
* `mkdir <nombre>` : Crea un directorio.
  * `-p` (crea toda la ruta de carpetas anidadas si no existen, ej. `mkdir -p app/src/config`).
* `touch <archivo>` : Crea un archivo vacío o actualiza su fecha de modificación.
* `cp <origen> <destino>` : Copia archivos o carpetas.
  * `-r` (recursivo, obligatorio para copiar carpetas enteras), `-v` (muestra qué está copiando).
* `mv <origen> <destino>` : Mueve o renombra archivos y carpetas.
* `rm <archivo>` : Elimina archivos o directorios.
  * `-r` (recursivo para carpetas), `-f` (forzar borrado sin preguntar).
* `find <ruta>` : Busca archivos y directorios en tiempo real.
  * `-name "*.log"` (por nombre exacto o patrón), `-type f` (solo archivos), `-type d` (solo carpetas), `-size +50M` (mayores a 50MB), `-mtime -7` (modificados en los últimos 7 días), `-exec <cmd> {} \;` (ejecuta un comando sobre cada hallazgo).
* `ln` : Crea enlaces entre archivos.
  * `-s <origen> <enlace>` (crea un **Symlink / Enlace simbólico** o acceso directo; sin `-s` crea un Hard Link).

### 1.3 Permisos y Propiedad
* **Lectura rápida Octal:** `4` = Lectura (`r`), `2` = Escritura (`w`), `1` = Ejecución (`x`), `0` = Sin permisos.
  * `755` (`rwxr-xr-x` : dueño todo, resto lee/ejecuta), `644` (`rw-r--r--` : archivos normales), `600` (`rw-------` : llaves privadas SSH), `400` (`r--------` : llaves `.pem` en solo lectura).
* `chmod <permisos> <archivo>` : Cambia los permisos de acceso.
  * `-R` (aplica recursivamente a toda una carpeta), `+x` (agrega permiso de ejecución rápido, ej. `chmod +x script.sh`).
* `chown <usuario>:<grupo> <archivo>` : Cambia el propietario y grupo de un archivo/carpeta.
  * `-R` (recursivo para carpetas enteras).
* `umask` : Muestra o define la máscara de permisos por defecto al crear archivos nuevos (ej. `0022`).

### 1.4 Usuarios, Grupos y Sudoers
* `whoami` : Muestra tu usuario actual.
* `id` : Muestra tu UID, GID y todos los grupos a los que perteneces.
* `useradd <usuario>` : Crea un nuevo usuario en el sistema.
  * `-m` (crea su carpeta en `/home/<usuario>`), `-s /bin/bash` (define Bash como su terminal por defecto), `-G <grupo>` (lo añade a grupos secundarios).
* `passwd <usuario>` : Asigna o cambia la contraseña de un usuario.
* `usermod` : Modifica un usuario existente.
  * `-aG <grupo> <usuario>` (**Crítico:** agrega el usuario a un grupo sin borrarlo de los anteriores, ej. `usermod -aG docker ubuntu`).
* `userdel -r <usuario>` : Elimina un usuario y su carpeta `/home`.
* `sudo <comando>` : Ejecuta una orden con privilegios de superusuario (`root`).
  * `sudo -i` o `sudo su -` (abre una sesión interactiva como `root`).
* `visudo` : Abre de forma segura el archivo `/etc/sudoers` para dar permisos de administrador sin corromper el sistema.
* **Archivos clave:** `/etc/passwd` (lista de usuarios y shells) y `/etc/shadow` (hashes de contraseñas cifradas).

### 1.5 Flujos I/O, Redirecciones y Lectura
* `>` : Redirige la salida estándar (`stdout`) a un archivo **sobrescribiendo** todo su contenido.
* `>>` : Redirige la salida estándar a un archivo **agregando** al final (append).
* `2>` : Redirige únicamente los errores (`stderr`) a un archivo (ej. `2> errores.log`).
* `&>` o `> archivo 2>&1` : Envía tanto la salida normal como los errores al mismo sitio (ej. `> /dev/null 2>&1` para silenciar todo).
* `|` (Pipe) : Conecta la salida del comando de la izquierda como entrada (`stdin`) del comando de la derecha.
* `cat <archivo>` : Imprime todo el contenido de un archivo en pantalla.
* `less <archivo>` : Abre un archivo largo para navegar por páginas (sales con la tecla `q`).
* `head -n <N> <archivo>` : Muestra las primeras `N` líneas.
* `tail -n <N> <archivo>` : Muestra las últimas `N` líneas.
  * `-f` (**Fundamental:** se queda escuchando en vivo las nuevas líneas que se escriben en un log).
* `grep "<patrón>" <archivo>` : Filtra y busca texto dentro de archivos o salidas.
  * `-i` (ignora mayúsculas/minúsculas), `-r` (busca en toda una carpeta), `-v` (invierte el filtro: muestra lo que NO coincide), `-n` (muestra número de línea).

---

## ⚙️ 2. LINUX — FASE 2: Procesos, Systemd, Logs, Discos y Cron

### 2.1 Control de Procesos
* `ps` : Muestra instantánea de los procesos actuales.
  * `ps aux` (muestra todos los procesos de todos los usuarios con consumo de CPU/RAM), `ps -ef` (muestra árbol y PID/PPID).
* `top` / `htop` : Monitor interactivo de procesos y recursos en tiempo real.
* `kill <PID>` : Envía una señal a un proceso por su ID.
  * `-15` o `SIGTERM` (por defecto: pide al proceso cerrarse limpiamente), `-9` o `SIGKILL` (forzado inmediato: mata el proceso sin dejarlo guardar nada).
* `pkill -f <nombre>` : Mata procesos buscando por su nombre o comando en lugar del PID.
* `&` (al final de un comando) : Ejecuta el proceso en segundo plano (background).

### 2.2 Administrador de Servicios (`systemd`) y Logs
* `systemctl <acción> <servicio>` : Controla demonios y servicios (ej. `nginx`, `docker`, `ssh`).
  * `status` (ve si está activo y últimos logs), `start` (inicia), `stop` (detiene), `restart` (reinicia todo), `reload` (recarga configuración sin tirar conexiones activas), `enable` (activa arranque automático al prender el servidor), `disable` (desactiva arranque automático).
* `systemctl daemon-reload` : Obligatorio después de crear o editar un archivo `.service` manual.
* `journalctl` : Consulta los logs centralizados de `systemd`.
  * `-u <servicio>` (filtra solo un servicio, ej. `journalctl -u nginx`), `-f` (sigue el log en vivo), `-n 50` (últimas 50 líneas), `-xe` (va directo al final con explicación de errores recientes).

### 2.3 Gestión de Paquetes (Debian/Ubuntu)
* `apt update` / `apt-get update` : Descarga y actualiza la lista de paquetes disponibles en los repositorios.
* `apt upgrade -y` : Actualiza todos los paquetes instalados a su nueva versión.
* `apt install -y <paquete>` : Instala un programa aceptando automáticamente la confirmación (`--no-install-recommends` evita instalar paquetes extra no esenciales).
* `apt remove <paquete>` : Desinstala un paquete (`apt purge` borra también sus archivos de configuración).

### 2.4 Almacenamiento y Memoria
* `df` : Muestra el espacio libre y usado de los discos montados.
  * `-h` (formato humano en GB/MB), `-T` (muestra tipo de sistema de archivos ext4/xfs).
* `du` : Calcula cuánto pesa una carpeta o archivo específico.
  * `-sh <ruta>` (`-s` da solo el total resumido, `-h` en formato legible; ej. `du -sh /var/log/*`).
* `free` : Muestra el uso de memoria RAM y memoria Swap.
  * `-h` o `-m` (en Gigabytes/Megabytes).
* `lsblk` : Lista en árbol todos los discos físicos y particiones conectadas al servidor.
* `mount <dispositivo> <carpeta>` / `umount <carpeta>` : Monta o desmonta un disco en una ruta.

### 2.5 Automatización y Micro-configuraciones de Sistema (Cron y Systemd)
* `crontab` : Programa tareas repetitivas automáticas.
  * `-e` (edita tu tabla de tareas cron), `-l` (lista tus tareas programadas actuales).

**📋 Formato de línea Crontab (`crontab -e`):**
```text
# ┌───────────── minuto (0 - 59)
# │ ┌───────────── hora (0 - 23)
# │ │ ┌───────────── día del mes (1 - 31)
# │ │ │ ┌───────────── mes (1 - 12)
# │ │ │ │ ┌───────────── día de la semana (0 - 6) (0 = Domingo)
# * * * * *  /ruta/absoluta/al/comando_o_script.sh >> /var/log/mi_cron.log 2>&1
30 2 * * * /usr/bin/python3 /home/ubuntu/backup_s3.py
```

**📋 Estructura mínima de un Unit File de Systemd (`/etc/systemd/system/mi-app.service`):**
```ini
[Unit]
Description=Servicio Web Flask con Gunicorn
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/mi-app
ExecStart=/usr/local/bin/gunicorn --bind 0.0.0.0:5000 --workers 3 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

---

## 🌐 3. LINUX — FASE 3: Redes, SSH, Firewall y NGINX

### 3.1 Diagnóstico de Red y DNS
* `ip` : Configuración e inspección de tarjetas de red y rutas.
  * `ip a` o `ip addr` (muestra tus direcciones IP privadas/públicas e interfaces como `eth0`, `docker0`), `ip r` o `ip route` (muestra la tabla de enrutamiento y puerta de enlace/Gateway).
* `ping -c 4 <destino>` : Prueba conectividad ICMP enviando 4 paquetes.
* `dig <dominio>` : Consulta servidores DNS para resolver nombres a IPs.
  * `+short` (devuelve únicamente la IP limpia sin texto extra), `@8.8.8.8` (fuerza la consulta usando un servidor DNS específico).
* **Archivos clave de resolución:** `/etc/hosts` (mapeo manual local de IPs a nombres) y `/etc/resolv.conf` (servidores DNS configurados).

### 3.2 Sockets, Puertos y Peticiones HTTP
* `ss` : Inspecciona qué puertos están abiertos y escuchando en el servidor (reemplazo moderno de `netstat`).
  * `-tulnp` (**Combo de memoria obligatorio:** `-t` TCP, `-u` UDP, `-l` solo en escucha/Listening, `-n` números de puerto sin traducir nombres, `-p` muestra qué programa/PID usa ese puerto).
* `curl <url>` : Realiza peticiones HTTP/HTTPS desde la terminal.
  * `-I` (muestra solo las cabeceras HTTP y el código de estado `200 OK`), `-v` (modo detallado para depurar errores de red/TLS), `-X POST` (define verbo HTTP), `-L` (sigue redirecciones).
* `nc` (Netcat) : Navaja suiza para probar puertos TCP/UDP directos.
  * `-zv <host> <puerto>` (`-z` solo escanea sin enviar datos, `-v` muestra si conectó o fue rechazado; ej. `nc -zv mi-rds.amazonaws.com 5432`).

### 3.3 SSH Avanzado, Transferencias y Túneles
* `ssh-keygen` : Genera tu par de llaves criptográficas (pública `.pub` y privada).
  * `-t ed25519` (algoritmo moderno recomendado, más rápido y seguro que RSA), `-C "comentario"`.
* `ssh <usuario>@<ip>` : Inicia sesión remota segura.
  * `-i <ruta_llave.pem>` (especifica archivo de llave privada), `-p <puerto>` (si SSH no usa el 22).
* **Túneles SSH (Port Forwarding):**
  * `ssh -L <puerto_local>:<host_remoto>:<puerto_remoto> <user>@<servidor_ssh>` (**Local Forwarding:** trae un servicio privado remoto, como RDS en el puerto 5432, hacia un puerto de tu propia laptop).
  * `ssh -R <puerto_remoto>:localhost:<puerto_local> <user>@<servidor_ssh>` (**Remote Forwarding:** expone un puerto de tu laptop hacia el servidor remoto).
* `scp` : Copia archivos por red sobre SSH.
  * `scp -i llave.pem archivo.txt ubuntu@<ip>:/home/ubuntu/` (`-r` para carpetas).
* `rsync` : Sincroniza carpetas transfiriendo **solo los cambios** (mucho más eficiente que `scp`).
  * `-avz -e "ssh -i llave.pem" ./carpeta_local/ ubuntu@<ip>:/ruta/destino/` (`-a` preserva permisos/fechas, `-v` detallado, `-z` comprime datos en tránsito).

**📋 Micro-configuración SSH (`~/.ssh/config` — Para entrar con `ssh mi-ec2` sin escribir IPs ni llaves):**
```sshconfig
Host mi-ec2
    HostName 54.123.45.67
    User ubuntu
    IdentityFile ~/.ssh/mi-llave-aws.pem
    Port 22
```

### 3.4 Cortafuegos (`ufw` - Uncomplicated Firewall)
* `sudo ufw status numbered` : Muestra si el firewall está activo y las reglas numeradas.
* `sudo ufw default deny incoming` : Regla base de seguridad (bloquea todo lo que intente entrar).
* `sudo ufw default allow outgoing` : Permite que el servidor salga a internet.
* `sudo ufw allow 22/tcp` (o `allow OpenSSH`) : **Vital hacerlo antes del `enable`** para no quedarte fuera del servidor.
* `sudo ufw allow 80/tcp` / `allow 443/tcp` : Abre tráfico web HTTP/HTTPS.
* `sudo ufw enable` / `disable` : Enciende o apaga el firewall.
* `sudo ufw delete <número>` : Borra una regla según su número en `status numbered`.

### 3.5 Servidor Web y Reverse Proxy (NGINX)
* `sudo nginx -t` : **Comando obligatorio antes de reiniciar:** valida la sintaxis de tus archivos `.conf` para asegurar que no haya errores de punto y coma `;`.
* `sudo systemctl reload nginx` : Aplica la nueva configuración sin cortar el servicio.
* **Rutas clave en Ubuntu:**
  * `/etc/nginx/conf.d/default.conf` (en imagen oficial de Docker y NGINX estándar).
  * `/etc/nginx/sites-available/` (donde creas tu archivo en Ubuntu) y `/etc/nginx/sites-enabled/` (donde creas un symlink con `ln -s` para activarlo).

**📋 Las 3 Directivas Clave del Reverse Proxy (`/etc/nginx/conf.d/default.conf`):**
```nginx
server {
    # 1. PUERTO DE ENTRADA: Escucha peticiones públicas en el puerto 80 (HTTP)
    listen 80;
    server_name _;  # "_" acepta cualquier dominio o dirección IP pública

    location / {
        # 2. EL DESVÍO (Reverse Proxy): Envía el tráfico a tu app Flask/Gunicorn
        # (Usa 127.0.0.1:5000 si corre en el host, o http://web:5000 si están en Docker Compose)
        proxy_pass http://web:5000;

        # 3. PRESERVACIÓN DE IDENTIDAD: Pasa la IP real del cliente y el dominio original a Flask
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🐳 4. DOCKER — FASES 1, 2 Y 3: CLI, Dockerfile y Docker Compose

### 4.1 Docker — Fase 1: Ciclo de Vida y Comandos CLI
* `docker build -t <nombre>:<tag> .` : Construye una imagen leyendo el `Dockerfile` del directorio actual (`.`).
  * `--no-cache` (fuerza a reconstruir todas las capas ignorando la caché).
* `docker run <imagen>` : Crea y arranca un contenedor nuevo.
  * `-d` (Detached: corre en segundo plano sin bloquear la terminal).
  * `--name <nombre>` (asigna un nombre legible al contenedor).
  * `-p <puerto_host>:<puerto_contenedor>` (mapea/abre un puerto de tu máquina física hacia el contenedor, ej. `-p 80:5000`).
  * `-e CLAVE=VALOR` (inyecta una variable de entorno suelta) o `--env-file .env` (carga todo el archivo `.env`).
  * `-v <origen>:<destino>` (monta un Volumen si `<origen>` es un nombre, o un Bind Mount si empieza con `/` o `./`; añade `:ro` al final para solo lectura).
  * `--network <red>` (conecta el contenedor a una red Bridge específica).
  * `--rm` (borra el contenedor automáticamente apenas se detenga; ideal para pruebas rápidas).
  * `-it` (modo interactivo con terminal acoplada, ej. `docker run -it python:3.11-slim bash`).
* `docker ps` : Lista los contenedores que están encendidos ahora mismo.
  * `-a` (muestra absolutamente todos, incluyendo los apagados o que fallaron al arrancar).
* `docker logs <contenedor>` : Muestra la salida y errores (`stdout`/`stderr`) del contenedor.
  * `-f` (sigue los logs en vivo), `--tail 50` (solo las últimas 50 líneas).
* `docker exec -it <contenedor> <comando>` : Entra o ejecuta una orden dentro de un contenedor que ya está corriendo (ej. `docker exec -it flask_app bash` o `sh`).
* `docker stop <contenedor>` / `docker start <contenedor>` / `docker restart <contenedor>` : Apaga, prende o reinicia un contenedor existente.
* `docker rm <contenedor>` : Elimina un contenedor apagado (`-f` lo mata y elimina aunque esté corriendo).
* `docker images` (o `docker image ls`) : Lista las imágenes descargadas o creadas en tu máquina.
* `docker rmi <imagen>` : Borra una imagen local.
* `docker system prune` : Limpia contenedores apagados, redes sin usar e imágenes huérfanas.
  * `-a --volumes` (limpieza profunda: borra todas las imágenes que no estén en uso y los volúmenes).
* `docker stats` : Muestra consumo de CPU, RAM y Red de cada contenedor en vivo (como `htop`).

### 4.2 Docker — Fase 2: Sintaxis de `Dockerfile` (En orden lógico de Caché de Capas)
1. `FROM <imagen>:<tag> [AS <alias>]` : Define la imagen base (ej. `python:3.11-slim`). Usar `AS builder` nombra la etapa para hacer **Multi-stage builds**.
2. `ARG <nombre>=<valor>` : Define variables que **solo existen durante el `docker build`** (no quedan en el contenedor final).
3. `WORKDIR /ruta` : Crea la carpeta dentro de la imagen y se posiciona en ella (como `mkdir` + `cd`).
4. `ENV <CLAVE>=<VALOR>` : Define variables de entorno permanentes que **sí viven cuando el contenedor corre** (`PYTHONDONTWRITEBYTECODE=1`, `PYTHONUNBUFFERED=1`).
5. `RUN <comando>` : Ejecuta comandos de Linux durante la construcción de la imagen (instalar paquetes `apt`, `pip install`, crear usuarios `useradd`). Cada `RUN` crea una capa.
6. `COPY <origen> <destino>` : Copia archivos desde tu máquina al contenedor.
   * `--from=<alias>` (trae archivos limpios desde una etapa anterior del Multi-stage).
   * `--chown=<user>:<group>` (asigna dueño sin gastar una capa extra).
7. `USER <usuario>` : Cambia el usuario activo (de `root` a un usuario sin privilegios) para el resto del build y para el arranque.
8. `EXPOSE <puerto>` : Documenta qué puerto interno escucha el contenedor (no publica el puerto al host por sí solo).
9. `ENTRYPOINT ["ejecutable"]` : Convierte el contenedor en un binario fijo difícil de sobrescribir (los argumentos extras de `docker run` se le pegan al final).
10. `CMD ["ejecutable", "param1"]` : Define el comando por defecto de encendido (fácil de reemplazar al hacer `docker run`).
    * **Arranque de producción en Python:** `CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "3", "app:app"]`

**📋 Archivo `.dockerignore` (Obligatorio junto al `Dockerfile`):**
```text
__pycache__/
*.pyc
.git
.gitignore
venv/
.env
README.md
```

### 4.3 Docker — Fase 3: Redes, Volúmenes y Orquestación (`docker-compose.yml`)
* **Comandos CLI de Red y Volúmenes:**
  * `docker network ls` (lista redes), `docker network create <nombre>` (crea red bridge), `docker network inspect <nombre>` (ve qué contenedores e IPs están dentro).
  * `docker volume ls` (lista volúmenes administrados), `docker volume inspect <nombre>` (muestra la ruta física en `/var/lib/docker/volumes/...`), `docker volume rm <nombre>`.
* **Comandos CLI de Docker Compose:**
  * `docker compose up` : Crea la red, volúmenes y levanta todos los servicios.
    * `-d` (en segundo plano), `--build` (fuerza a recompilar los `Dockerfile` antes de arrancar).
  * `docker compose down` : Apaga y borra los contenedores y la red del proyecto.
    * `-v` (**Cuidado:** borra también los volúmenes administrados declarados en el compose, destruyendo los datos de la BD local).
  * `docker compose ps` : Muestra el estado de los servicios del proyecto (incluyendo si están `healthy` o `starting`).
  * `docker compose logs -f <servicio>` : Sigue en vivo los logs de un servicio específico (ej. `web` o `db`).
  * `docker compose exec <servicio> <cmd>` : Ejecuta un comando dentro de un servicio del compose.

**📋 Estructura Maestra de `docker-compose.yml` (Diferenciando `ports` vs `expose`, Volúmenes y Healthcheck):**
```yaml
services:
  # 1. Reverse Proxy (El único que da la cara a Internet en el puerto 80)
  nginx:
    image: nginx:alpine
    container_name: proxy_nginx
    ports:
      - "80:80"  # PORTS: Abre el puerto 80 de la máquina física (EC2) hacia el exterior
    volumes:
      - ./default.conf:/etc/nginx/conf.d/default.conf:ro  # BIND MOUNT (Solo lectura)
    depends_on:
      - web
    networks:
      - red_interna
    restart: always

  # 2. Aplicación Backend (Flask + Gunicorn)
  web:
    build: .
    container_name: flask_app
    expose:
      - "5000"   # EXPOSE: Solo accesible ADENTRO de 'red_interna' (Nginx llega a web:5000, pero nadie desde fuera de EC2 puede entrar al 5000)
    env_file:
      - .env     # Carga todas las variables desde el archivo .env automáticamente
    environment:
      - DB_HOST=db  # En local apunta a 'db'; en producción apunta a $RDS_ENDPOINT
    depends_on:
      db:
        condition: service_healthy  # Espera a que el healthcheck de 'db' dé OK antes de arrancar
    networks:
      - red_interna
    restart: always

  # 3. Base de Datos Local (Opcional si no usas RDS en desarrollo)
  db:
    image: postgres:15-alpine
    container_name: postgres_db
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    expose:
      - "5432"   # Aislado del exterior, solo 'web' puede hablarle por red_interna
    volumes:
      - pgdata:/var/lib/postgresql/data  # VOLUMEN ADMINISTRADO (Persistencia gestionada por Docker)
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - red_interna
    restart: always

volumes:
  pgdata:  # Registro global del volumen administrado

networks:
  red_interna:
    driver: bridge  # Switch virtual privado con DNS interno automático
```

---

## ☁️ 5. AWS CLI — Comandos Esenciales (Etapa 1 / Proyecto 1)

### 5.1 Configuración, Identidad (STS) y Banderas Globales
* `aws configure` : Configura Access Key, Secret Key, región (`us-east-1`) y formato (`json`). (`--profile <nombre>`).
* `aws sts get-caller-identity` : El `whoami` de AWS (muestra `Account`, `UserId` y `Arn` activo).
* `aws sts assume-role --role-arn <ARN> --role-session-name <Nombre>` : Asume un rol IAM temporalmente.
* `aws <servicio> help | grep "<palabra>"` : Busca comandos de un servicio sin saber el nombre exacto.
* `aws <servicio> <acción> help | grep -A 15 "EXAMPLES"` : Muestra ejemplos directos de uso en terminal.
* **Banderas globales:** `--region us-east-1` | `--profile <perfil>` | `--output json | table | text` | `--query "<expresión>"`.

### 5.2 Amazon S3 (Almacenamiento de Objetos)

#### A. Comandos Rápidos (`aws s3`)
* `aws s3 ls` : Lista buckets (o `aws s3 ls "s3://$BUCKET_PRO/"` para ver objetos).
* `aws s3 mb "s3://$BUCKET_SIMPLE" --region "$REGION"` : Crea un bucket.
* `aws s3 cp prueba.txt "s3://$BUCKET_SIMPLE/"` : Sube/descarga archivos (`--recursive` para carpetas).
* `aws s3 mv <origen> <destino>` : Mueve objetos.
* `aws s3 rm "s3://$BUCKET_SIMPLE/prueba.txt"` : Borra un objeto (`--recursive` vacía ruta).
* `aws s3 sync ./backups "s3://$BUCKET_PRO/backups" --delete` : Sincroniza cambios locales con S3.
* `aws s3 presign "s3://$BUCKET_PRO/archivo.pdf" --expires-in 3600` : Genera URL temporal de descarga (1h).
* `aws s3 rb "s3://$BUCKET_SIMPLE" --force` : Vacía y elimina el bucket.

#### B. Secuencia Lógica (`aws s3api`)
```bash
# Variables base
REGION="us-east-1"
BUCKET="bucket-pro-${RANDOM}"

# 1. Crear bucket
aws s3api create-bucket \
    --bucket "$BUCKET" \
    --region "$REGION"

# 2. Activar versionado
aws s3api put-bucket-versioning \
    --bucket "$BUCKET" \
    --versioning-configuration Status=Enabled

# 3. Bloquear acceso público (4 candados)
aws s3api put-public-access-block \
    --bucket "$BUCKET" \
    --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# 4. Activar cifrado en reposo (AES256)
aws s3api put-bucket-encryption \
    --bucket "$BUCKET" \
    --server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'

# 5. Asignar etiquetas (Tags)
aws s3api put-bucket-tagging \
    --bucket "$BUCKET" \
    --tagging "TagSet=[{Key=Environment,Value=Dev},{Key=Project,Value='EJEMPLO'}]"

# 6. Configurar Lifecycle (ciclo de vida)
cat << 'EOF' > lifecycle.json
{
    "Rules": [
        {
            "ID": "BorrarLogsTemporales30Dias",
            "Filter": { "Prefix": "logs/" },
            "Status": "Enabled",
            "Expiration": { "Days": 30 }
        }
    ]
}
EOF

aws s3api put-bucket-lifecycle-configuration \
    --bucket "$BUCKET" \
    --lifecycle-configuration file://lifecycle.json

# 7. Auditoría del bucket
aws s3api get-bucket-versioning --bucket "$BUCKET" --query "Status" --output text
aws s3api get-public-access-block --bucket "$BUCKET"
aws s3api get-bucket-encryption --bucket "$BUCKET"
aws s3api get-bucket-lifecycle-configuration --bucket "$BUCKET"
```

### 5.3 IAM Roles e Instance Profiles (Acceso EC2 a S3 sin Llaves)

```bash
# Variables IAM
NOMBRE_ROL="RolMicroSD-Facturacion"
NOMBRE_ADAPTADOR="AdaptadorSD-FacturacionEC2"

# 1. Trust Policy (autorizar a EC2) y crear Rol
cat << 'EOF' > trust-ec2.json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": { "Service": "ec2.amazonaws.com" },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF

aws iam create-role \
    --role-name "$NOMBRE_ROL" \
    --assume-role-policy-document file://trust-ec2.json

# 2. Permissions Policy (acceso exclusivo al ARN del bucket)
cat << EOF > permisos-boletas.json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": ["s3:ListBucket"],
            "Resource": "arn:aws:s3:::${BUCKET}"
        },
        {
            "Effect": "Allow",
            "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
            "Resource": "arn:aws:s3:::${BUCKET}/*"
        }
    ]
}
EOF

aws iam put-role-policy \
    --role-name "$NOMBRE_ROL" \
    --policy-name "PermisoExclusivoBucket" \
    --policy-document file://permisos-boletas.json

# (Alternativa: adjuntar política global de AWS)
# aws iam attach-role-policy --role-name "$NOMBRE_ROL" --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

# 3. Crear Instance Profile (Adaptador) y unir el Rol
aws iam create-instance-profile --instance-profile-name "$NOMBRE_ADAPTADOR"

aws iam add-role-to-instance-profile \
    --instance-profile-name "$NOMBRE_ADAPTADOR" \
    --role-name "$NOMBRE_ROL"
```

### 5.4 Amazon EC2 y Security Groups (Cómputo y Firewall)

#### A. Secuencia Lógica de Despliegue EC2
```bash
# 1. Crear llave SSH (.pem) y ajustar permisos (400)
aws ec2 create-key-pair \
    --key-name "${PROYECTO}-key" \
    --query 'KeyMaterial' \
    --output text > "${PROYECTO}-key.pem"
chmod 400 "${PROYECTO}-key.pem"

# 2. Crear Security Group y capturar $SG_ID
SG_ID=$(aws ec2 create-security-group \
    --group-name "${PROYECTO}-sg" \
    --description "Firewall EC2" \
    --query 'GroupId' \
    --output text)

# 3. Abrir puertos 22 (solo mi IP) y 80 (público)
MI_IP=$(curl -s https://checkip.amazonaws.com)

aws ec2 authorize-security-group-ingress \
    --group-id "$SG_ID" \
    --protocol tcp --port 22 --cidr "${MI_IP}/32"

aws ec2 authorize-security-group-ingress \
    --group-id "$SG_ID" \
    --protocol tcp --port 80 --cidr "0.0.0.0/0" 2>/dev/null || echo "Puerto 80 ya activo"

# 4. Obtener AMI_ID dinámica (Ubuntu 24.04 LTS desde SSM)
AMI_ID=$(aws ssm get-parameters \
    --names "/aws/service/canonical/ubuntu/server/24.04/stable/current/amd64/hvm/ebs-gp3/ami-id" \
    --query 'Parameters[0].Value' \
    --output text)

# 5. Script de inicio (User Data)
cat << 'EOF' > setup.sh
#!/bin/bash
apt-get update -y && apt-get install -y nginx
systemctl enable nginx && systemctl start nginx
EOF

# 6. Lanzar instancia EC2 y capturar $INSTANCE_ID
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id "$AMI_ID" \
    --instance-type "t3.micro" \
    --key-name "${PROYECTO}-key" \
    --security-group-ids "$SG_ID" \
    --iam-instance-profile Name="$NOMBRE_ADAPTADOR" \
    --user-data file://setup.sh \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${PROYECTO}-server}]" \
    --query 'Instances[0].InstanceId' \
    --output text)

# 7. Esperar estado 'running', extraer $IP_PUBLICA y conectar por SSH
aws ec2 wait instance-running --instance-ids "$INSTANCE_ID"

IP_PUBLICA=$(aws ec2 describe-instances \
    --instance-ids "$INSTANCE_ID" \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)

ssh -i "${PROYECTO}-key.pem" ubuntu@"$IP_PUBLICA"
```

#### B. Auditoría y Control EC2
* **Tabla resumen de instancias:** `aws ec2 describe-instances --query "Reservations[*].Instances[*].[InstanceId, State.Name, PublicIpAddress, Tags[?Key=='Name']|[0].Value]" --output table`
* **Buscar ID por Tag `Name`:** `aws ec2 describe-instances --filters "Name=tag:Name,Values=${PROYECTO}-server" "Name=instance-state-name,Values=running" --query "Reservations[0].Instances[0].InstanceId" --output text`
* **Explorar catálogo SSM:** `aws ssm get-parameters-by-path --path "/aws/service/ami-amazon-linux-latest" --query "Parameters[].Name"`
* **Asociar IAM Profile a EC2 ya encendida:** `aws ec2 associate-iam-instance-profile --instance-id "$INSTANCE_ID" --iam-instance-profile Name="$NOMBRE_ADAPTADOR"`
* **Control de estado:** `aws ec2 stop-instances --instance-ids "$INSTANCE_ID"` | `aws ec2 start-instances --instance-ids "$INSTANCE_ID"` | `aws ec2 terminate-instances --instance-ids "$INSTANCE_ID"`.

### 5.5 Amazon RDS (PostgreSQL Privado) y Teardown Completo

#### A. Secuencia Lógica RDS
```bash
# 1. Definir identificador de instancia RDS
DB_ID="${PROYECTO}-db"

# 2. Crear Security Group exclusivo para RDS ($RDS_SG_ID)
RDS_SG_ID=$(aws ec2 create-security-group \
    --group-name "${PROYECTO}-rds-sg" \
    --description "Firewall privado RDS" \
    --query 'GroupId' \
    --output text)

# 3. Encadenar Security Groups (permitir puerto 5432 solo desde $SG_ID de EC2)
aws ec2 authorize-security-group-ingress \
    --group-id "$RDS_SG_ID" \
    --protocol tcp \
    --port 5432 \
    --source-group "$SG_ID"

# 4. Lanzar instancia RDS PostgreSQL privada
aws rds create-db-instance \
    --db-instance-identifier "$DB_ID" \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username postgres \
    --master-user-password "CloudVault2026Seguro!" \
    --allocated-storage 20 \
    --db-name cloudvault \
    --vpc-security-group-ids "$RDS_SG_ID" \
    --no-publicly-accessible \
    --backup-retention-period 0 \
    --no-multi-az > /dev/null

# 5. Esperar disponibilidad y extraer $RDS_ENDPOINT
aws rds wait db-instance-available --db-instance-identifier "$DB_ID"

RDS_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier "$DB_ID" \
    --query "DBInstances[0].Endpoint.Address" \
    --output text)

# 6. Conectar desde adentro de la EC2
psql -h "$RDS_ENDPOINT" -p 5432 -U postgres -d cloudvault
```

#### B. Auditoría RDS y Limpieza Total (Teardown en Orden Inverso)
* **Tabla de instancias RDS:** `aws rds describe-db-instances --query "DBInstances[*].[DBInstanceIdentifier, DBInstanceStatus, Endpoint.Address]" --output table`
* **Modificar Security Group RDS:** `aws rds modify-db-instance --db-instance-identifier "$DB_ID" --vpc-security-group-ids "$RDS_SG_ID" --apply-immediately > /dev/null`
* **Pausar / Reanudar RDS:** `aws rds stop-db-instance --db-instance-identifier "$DB_ID"` | `aws rds start-db-instance --db-instance-identifier "$DB_ID"`

```bash
# TEARDOWN COMPLETO (Orden inverso de dependencias)
# 1. Eliminar RDS, terminar EC2 y vaciar/borrar S3
aws rds delete-db-instance --db-instance-identifier "$DB_ID" --skip-final-snapshot --delete-automated-backups > /dev/null
aws ec2 terminate-instances --instance-ids "$INSTANCE_ID" > /dev/null
aws s3 rb "s3://$BUCKET_PRO" --force

# 2. Desmontar IAM (sacar Rol del Adaptador, borrar Adaptador, Política y Rol)
aws iam remove-role-from-instance-profile --instance-profile-name "$NOMBRE_ADAPTADOR" --role-name "$NOMBRE_ROL"
aws iam delete-instance-profile --instance-profile-name "$NOMBRE_ADAPTADOR"
aws iam delete-role-policy --role-name "$NOMBRE_ROL" --policy-name "PermisoExclusivoBucket"
aws iam delete-role --role-name "$NOMBRE_ROL"

# 3. Esperar eliminación de máquinas y borrar Firewalls + Key Pair
aws ec2 wait instance-terminated --instance-ids "$INSTANCE_ID"
aws rds wait db-instance-deleted --db-instance-identifier "$DB_ID"

aws ec2 delete-security-group --group-id "$RDS_SG_ID"
aws ec2 delete-security-group --group-id "$SG_ID"
aws ec2 delete-key-pair --key-name "${PROYECTO}-key"
rm -f "${PROYECTO}-key.pem" setup.sh lifecycle.json trust-ec2.json permisos-boletas.json
```