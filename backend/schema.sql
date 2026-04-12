CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('CLIENT', 'ADMIN'))
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(30) UNIQUE NOT NULL,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    card_number VARCHAR(20) UNIQUE NOT NULL,
    expiry_date VARCHAR(10) NOT NULL
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('PAYMENT', 'TOPUP')),
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

//Example data
INSERT INTO users (login, password, role)
VALUES 
('admin1', '$2b$10$26QDW2zHqaU0XbdhZfdqwuE98C4/zLcAb8ZdcIQlVGTsrZ8sXTqbm', 'ADMIN'),
('admin2', '$2b$10$.oydECbkaExEwNhkzUBRS.mS4.SeeULrmjjHAB.qO/kbd9pas1EvS', 'ADMIN'),
('client1', '$2b$04$K5ENzknUWd0y.X7oQ5PaLO7Nt0hbPbUn73PsxndnMqJ/Njr2kHgi2', 'CLIENT'),
('client2', '$2b$10$fx2O4QysjsJgEeybJabejuDFpnMq3FR.o4EMsjZ5sOHZHulvr5PIi', 'CLIENT');

//Check data
SELECT id, login, role
FROM users
ORDER BY id;

//Adding accounts
INSERT INTO accounts (user_id, account_number, balance, is_blocked)
VALUES
(3, 'ACC1001', 1000.00, FALSE),
(3, 'ACC1002', 500.00, FALSE);

INSERT INTO accounts (user_id, account_number, balance, is_blocked)
VALUES
(4, 'ACC2001', 700.00, FALSE),
(4, 'ACC2002', 1500.00, FALSE);

//Check accounts
SELECT id, user_id, account_number, balance, is_blocked
FROM accounts
ORDER BY id;

//Adding cards to accounts
INSERT INTO cards (account_id, card_number, expiry_date)
VALUES
(1, '4111111111111001', '12/27'),
(1, '4111111111111002', '01/28');

INSERT INTO cards (account_id, card_number, expiry_date)
VALUES
(2, '4111111111112001', '03/27'),
(2, '4111111111112002', '04/28');

INSERT INTO cards (account_id, card_number, expiry_date)
VALUES
(3, '4111111111113001', '05/27'),
(3, '4111111111113002', '06/28');

INSERT INTO cards (account_id, card_number, expiry_date)
VALUES
(4, '4111111111114001', '07/27'),
(4, '4111111111114002', '08/28');

//Check cards
SELECT id, account_id, card_number, expiry_date
FROM cards
ORDER BY id;

//Adding payments
INSERT INTO payments (account_id, amount, type, description)
VALUES
(1, 100.00, 'TOPUP', 'Initial top up'),
(1, 50.00, 'PAYMENT', 'Test payment'),
(3, 200.00, 'TOPUP', 'Initial top up'),
(4, 120.00, 'PAYMENT', 'Test payment');