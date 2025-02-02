# Test

Тестовий сервер авторизації користувачів.

Механіка роботи сервісу:

- Не авторизовані користувачі не мають доступу до сторінки /home та до методу /get-user-info.
- Користувачу спочатку необхідно створити особистий кабінет за допомогою сторінки /signup.
- Далі користувач повиненн авторизуватися за допомогою сторінки /login
- Після успішної авторизації користувач потрапляє на сторінку /home яка доступна тільки авторизованим користувачам
- Для виходу із кабінету користувачу необхідно виконати метод /logout після чого відбувається перенаправлення на сторінку /login
- при переході на / в залежності від того, авторизований користувач чи ні - відбувається перенаправлення на сторінку /login або /home

## Завдання

1. Необхідно покрити тестами всі api методи та перевірити правильність відповіді сервера на можливі кейси роботи.
2. Розробити механізм тестування веб інтерфейсу сторінок /signup, /login, /home, / на правильність роботи.

## Requirements

- Node.js
- npm

## RUN

```bash
npm install
npm run start
```

## Tests

```bash
npm run test

# also, you can run only API tests using the next command:
npx mocha test/api.test.js --timeout 10000

# And you can run UI test(s) based on Cypress using the next command into terminal or command line:
npx cypress open

# If needed setup local environment, you can run before 'npx cypress open' command the next command line:
npm install cypress --save-dev

# When fully tests created/fixed or added as a new scenarios, you can run the next command for run Cypress tests:
npx cypress run

```

## Pages

- /
- /signup
- /login
- /home -> open if user authorized
- /api-docs -> swagger
