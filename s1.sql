use FYP;


CREATE TABLE Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE
);

CREATE TABLE Customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);



CREATE TABLE Farms (
    farm_id INT AUTO_INCREMENT PRIMARY KEY,
    farm_name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    owner_id INT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES Customers(customer_id) ON DELETE CASCADE
);
CREATE TABLE Workers (
    worker_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_title VARCHAR(100),
    farm_id int,
    FOREIGN KEY (farm_id) REFERENCES Farms(farm_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
CREATE TABLE Ponds (
    pond_id INT AUTO_INCREMENT PRIMARY KEY,
    pond_name VARCHAR(100) NOT NULL,
    farm_id INT NOT NULL,
    length FLOAT,
    width float,
    depth FLOAT,
    FOREIGN KEY (farm_id) REFERENCES Farms(farm_id) ON DELETE CASCADE
);

CREATE TABLE Devices (
    device_id INT AUTO_INCREMENT PRIMARY KEY,
    device_type VARCHAR(100),
    device_description VARCHAR(100) NOT NULL,
    nsensors int
    );

CREATE TABLE Installations (
    installation_id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    pond_id INT NOT NULL,
    installation_date DATE NOT NULL,
    status ENUM('Active', 'Inactive', 'Under Maintenance') DEFAULT 'Active',
    FOREIGN KEY (device_id) REFERENCES Devices(device_id) ON DELETE CASCADE,
    FOREIGN KEY (pond_id) REFERENCES Ponds(pond_id) ON DELETE CASCADE
);
