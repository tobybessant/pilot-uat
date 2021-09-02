FROM mcr.microsoft.com/mssql/server:2017-latest

ENV ACCEPT_EULA=Y
ENV SA_PASSWORD=Test@12345
ENV MSSQL_PID=Developer
ENV MSSQL_TCP_PORT=1433 

WORKDIR /src

RUN (/opt/mssql/bin/sqlservr --accept-eula & )