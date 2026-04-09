-- backend/database.sql
CREATE DATABASE IF NOT EXISTS immo_tunisie;
USE immo_tunisie;

-- Table des administrateurs
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des annonces
CREATE TABLE annonces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  type_bien ENUM('appartement','maison','villa','terrain','local','bureau') NOT NULL,
  type_transaction ENUM('vente','location') NOT NULL,
  prix DECIMAL(12,2) NOT NULL,
  surface DECIMAL(8,2),
  nb_pieces INT,
  nb_chambres INT,
  nb_salles_bain INT,
  gouvernorat VARCHAR(100),
  ville VARCHAR(100),
  adresse VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  nom_contact VARCHAR(100),
  tel_contact VARCHAR(20),
  email_contact VARCHAR(150),
  statut ENUM('active','inactive','en_attente') DEFAULT 'en_attente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des images des annonces
CREATE TABLE annonce_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  annonce_id INT NOT NULL,
  url VARCHAR(500) NOT NULL,
  is_principale BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (annonce_id) REFERENCES annonces(id) ON DELETE CASCADE
);

-- Table des caractéristiques (équipements)
CREATE TABLE annonce_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  annonce_id INT NOT NULL,
  feature VARCHAR(100) NOT NULL,
  FOREIGN KEY (annonce_id) REFERENCES annonces(id) ON DELETE CASCADE
);

-- Admin par défaut (mot de passe: Admin@123)
INSERT INTO admins (nom, email, password)
VALUES (
  'Admin',
  'admin@immo.tn',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
);