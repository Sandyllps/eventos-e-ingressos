#Define a imagem base com node.js
FROM node:24-alpine

#Define o diretório de trabalho dentro do container
WORKDIR /app

#Copia os arquivos de dependências
COPY package*.json ./

#Instala as dependências necessárias para a aplicação ser executada
RUN npm ci --omit=dev

#Copia o arquivo principal
COPY index.js ./

#Copia as pastas da API
COPY controllers/ ./controllers/
COPY routes/ ./routes/

#Copia os arquivos da interface
COPY index.html script.js style.css ./

#Porta utilizada pela aplicação
EXPOSE 8080

#Define o comando de inicialização do servidor
CMD ["node", "index.js"]
