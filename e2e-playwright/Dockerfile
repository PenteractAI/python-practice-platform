FROM mcr.microsoft.com/playwright:v1.38.0-focal

COPY . /e2e-playwright

WORKDIR /e2e-playwright

RUN npm install

RUN npx playwright install --with-deps chromium

CMD [ "npx", "playwright", "test", "--reporter=list" ]