-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: rocheli_db
-- ------------------------------------------------------
-- Server version	8.0.46-0ubuntu0.24.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `interest` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'confirmed',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `appointments_slot_unique` (`appointment_date`,`appointment_time`),
  KEY `appointments_appointment_date_status_index` (`appointment_date`,`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` bigint unsigned DEFAULT NULL,
  `title` json NOT NULL,
  `excerpt` json DEFAULT NULL,
  `body` json DEFAULT NULL,
  `author` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `read_time` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `articles_slug_unique` (`slug`),
  KEY `articles_category_id_foreign` (`category_id`),
  CONSTRAINT `articles_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES (1,'why-land-remains-cameroons-most-resilient-asset',1,'{\"en\": \"Why land remains Cameroon\'s most resilient asset\", \"fr\": \"Pourquoi le terrain reste l\'actif le plus résilient du Cameroun\"}','{\"en\": \"A look at long-term land value trends across major corridors.\", \"fr\": \"Un regard sur les tendances de valeur foncière à long terme.\"}',NULL,'Rocheli Desk','5 min read',NULL,'2026-05-24 08:31:24',1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(2,'seven-checks-before-you-sign',2,'{\"en\": \"The 7 checks every buyer must run before signing\", \"fr\": \"Les 7 vérifications avant de signer\"}','{\"en\": \"A practical due-diligence checklist for land buyers.\", \"fr\": \"Une liste de vérification pratique pour les acheteurs.\"}',NULL,'Rocheli Desk','7 min read',NULL,'2026-04-24 08:31:24',1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(3,'structured-savings-vs-traditional-plots',3,'{\"en\": \"Structured savings vs. traditional plots: what the numbers say\", \"fr\": \"Épargne structurée vs terrains traditionnels\"}','{\"en\": \"Comparing ownership paths side by side.\", \"fr\": \"Comparaison des parcours de propriété.\"}',NULL,'Rocheli Desk','6 min read',NULL,'2026-06-24 08:31:24',1,'2026-07-24 08:31:24','2026-07-24 08:31:24');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` json NOT NULL,
  `type` enum('article','property') COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'investing','{\"en\": \"Investing\", \"fr\": \"Investissement\"}','article',1,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(2,'legal','{\"en\": \"Legal\", \"fr\": \"Juridique\"}','article',2,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(3,'insights','{\"en\": \"Insights\", \"fr\": \"Analyses\"}','article',3,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(4,'residential','{\"en\": \"Residential\", \"fr\": \"Résidentiel\"}','property',1,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(5,'commercial','{\"en\": \"Commercial\", \"fr\": \"Commercial\"}','property',2,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(6,'land','{\"en\": \"Land\", \"fr\": \"Terrain\"}','property',3,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(7,'agricultural','{\"en\": \"Agricultural\", \"fr\": \"Agricole\"}','property',4,1,'2026-07-24 08:31:24','2026-07-24 08:31:24');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_en` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_fr` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cities_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,'yaounde','Yaounde','Yaoundé',1,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(2,'douala','Douala','Douala',2,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(3,'buea','Buea','Buea',3,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(4,'limbe','Limbe','Limbé',4,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(5,'bamenda','Bamenda','Bamenda',5,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(6,'bafoussam','Bafoussam','Bafoussam',6,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(7,'kribi','Kribi','Kribi',7,1,'2026-07-24 08:31:24','2026-07-24 08:31:24');
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_leads`
--

DROP TABLE IF EXISTS `contact_leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_leads` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `interest` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `email_sent` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_leads`
--

LOCK TABLES `contact_leads` WRITE;
/*!40000 ALTER TABLE `contact_leads` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interest` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('new','read','responded') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `response` text COLLATE utf8mb4_unicode_ci,
  `responded_by` bigint unsigned DEFAULT NULL,
  `responded_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contacts_responded_by_foreign` (`responded_by`),
  CONSTRAINT `contacts_responded_by_foreign` FOREIGN KEY (`responded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contributions`
--

DROP TABLE IF EXISTS `contributions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contributions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `member_id` bigint unsigned NOT NULL,
  `member_plan_id` bigint unsigned DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proof_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','successful','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `validated_by` bigint unsigned DEFAULT NULL,
  `validated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contributions_reference_unique` (`reference`),
  KEY `contributions_member_id_foreign` (`member_id`),
  KEY `contributions_validated_by_foreign` (`validated_by`),
  KEY `contributions_member_plan_id_foreign` (`member_plan_id`),
  CONSTRAINT `contributions_member_id_foreign` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE,
  CONSTRAINT `contributions_member_plan_id_foreign` FOREIGN KEY (`member_plan_id`) REFERENCES `member_plans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `contributions_validated_by_foreign` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contributions`
--

LOCK TABLES `contributions` WRITE;
/*!40000 ALTER TABLE `contributions` DISABLE KEYS */;
/*!40000 ALTER TABLE `contributions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enquiries`
--

DROP TABLE IF EXISTS `enquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `enquiries` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `member_id` bigint unsigned DEFAULT NULL,
  `property_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `interest` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `status` enum('sent','in_review','responded') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'sent',
  `response` text COLLATE utf8mb4_unicode_ci,
  `responded_by` bigint unsigned DEFAULT NULL,
  `responded_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `enquiries_member_id_foreign` (`member_id`),
  KEY `enquiries_property_id_foreign` (`property_id`),
  KEY `enquiries_responded_by_foreign` (`responded_by`),
  CONSTRAINT `enquiries_member_id_foreign` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE SET NULL,
  CONSTRAINT `enquiries_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
  CONSTRAINT `enquiries_responded_by_foreign` FOREIGN KEY (`responded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enquiries`
--

LOCK TABLES `enquiries` WRITE;
/*!40000 ALTER TABLE `enquiries` DISABLE KEYS */;
/*!40000 ALTER TABLE `enquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faqs`
--

DROP TABLE IF EXISTS `faqs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faqs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `question` json NOT NULL,
  `answer` json NOT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_published` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faqs`
--

LOCK TABLES `faqs` WRITE;
/*!40000 ALTER TABLE `faqs` DISABLE KEYS */;
INSERT INTO `faqs` VALUES (1,'{\"en\": \"How do I join the Land Access Club?\", \"fr\": \"Comment rejoindre le Land Access Club ?\"}','{\"en\": \"Create an account, choose a contribution plan, and complete your KYC — you can start contributing the same day.\", \"fr\": \"Créez un compte, choisissez un plan de contribution et complétez votre KYC — vous pouvez commencer à contribuer le jour même.\"}',1,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(2,'{\"en\": \"Are the properties legally verified?\", \"fr\": \"Les propriétés sont-elles légalement vérifiées ?\"}','{\"en\": \"Yes. Every plot is title-audited and geo-mapped before it\'s listed to members.\", \"fr\": \"Oui. Chaque parcelle est auditée et géo-cartographiée avant d\'être listée aux membres.\"}',2,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(3,'{\"en\": \"What happens if I miss a monthly contribution?\", \"fr\": \"Que se passe-t-il si je manque une contribution mensuelle ?\"}','{\"en\": \"Your allocation simply pauses — there are no penalties, and you can resume anytime.\", \"fr\": \"Votre allocation est simplement mise en pause — sans pénalité, et vous pouvez reprendre à tout moment.\"}',3,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(4,'{\"en\": \"Can I sell my property later?\", \"fr\": \"Puis-je vendre ma propriété plus tard ?\"}','{\"en\": \"Yes, once your title is issued you own the property outright and can sell, lease, or develop it.\", \"fr\": \"Oui, une fois votre titre émis, vous possédez la propriété en toute propriété et pouvez la vendre, la louer ou la développer.\"}',4,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(5,'{\"en\": \"Do you finance construction?\", \"fr\": \"Financez-vous la construction ?\"}','{\"en\": \"Not directly, but our team can connect you with vetted construction and financing partners.\", \"fr\": \"Pas directement, mais notre équipe peut vous mettre en relation avec des partenaires de construction et de financement vérifiés.\"}',5,1,'2026-07-24 08:31:24','2026-07-24 08:31:24');
/*!40000 ALTER TABLE `faqs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `legal_documents`
--

DROP TABLE IF EXISTS `legal_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `legal_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` json NOT NULL,
  `file_path_en` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_path_fr` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` int unsigned NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `legal_documents_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `legal_documents`
--

LOCK TABLES `legal_documents` WRITE;
/*!40000 ALTER TABLE `legal_documents` DISABLE KEYS */;
/*!40000 ALTER TABLE `legal_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member_plans`
--

DROP TABLE IF EXISTS `member_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member_plans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `member_id` bigint unsigned NOT NULL,
  `plan_id` bigint unsigned NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `goal` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferred_locations` json DEFAULT NULL,
  `land_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contribution_frequency` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contribution_amount` decimal(12,2) NOT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive','completed','suspended') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'suspended',
  `completed_at` timestamp NULL DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `subscribed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_reminded_due_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `member_plans_member_id_foreign` (`member_id`),
  KEY `member_plans_plan_id_foreign` (`plan_id`),
  CONSTRAINT `member_plans_member_id_foreign` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE,
  CONSTRAINT `member_plans_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member_plans`
--

LOCK TABLES `member_plans` WRITE;
/*!40000 ALTER TABLE `member_plans` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `members`
--

DROP TABLE IF EXISTS `members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `members` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `whatsapp` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `occupation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country_of_residence` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_document_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_document_back_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kin_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kin_relationship` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kin_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `goal` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferred_locations` json DEFAULT NULL,
  `land_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contribution_frequency` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contribution_amount` decimal(12,2) DEFAULT NULL,
  `payment_method` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agreements` json DEFAULT NULL,
  `signature` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agreed_at` timestamp NULL DEFAULT NULL,
  `status` enum('pending','under_review','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'approved',
  `submitted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `members_user_id_foreign` (`user_id`),
  CONSTRAINT `members_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `members`
--

LOCK TABLES `members` WRITE;
/*!40000 ALTER TABLE `members` DISABLE KEYS */;
/*!40000 ALTER TABLE `members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_07_15_133035_create_members_table',1),(5,'2026_07_16_013159_create_contributions_table',1),(6,'2026_07_17_100544_create_cities_table',1),(7,'2026_07_17_100544_create_plans_table',1),(8,'2026_07_17_114148_create_member_plans_table',1),(9,'2026_07_17_114302_add_member_plan_id_to_contributions_table',1),(10,'2026_07_17_114329_backfill_member_plans_from_members',1),(11,'2026_07_17_115937_add_last_reminded_due_at_to_member_plans_table',1),(12,'2026_07_17_115957_create_notifications_table',1),(13,'2026_07_18_072335_add_completed_at_to_member_plans_table',1),(14,'2026_07_18_113038_create_site_contents_table',1),(15,'2026_07_18_141327_create_articles_table',1),(16,'2026_07_18_141327_create_faqs_table',1),(17,'2026_07_18_141327_create_testimonials_table',1),(18,'2026_07_19_053431_create_categories_table',1),(19,'2026_07_19_053523_change_category_to_foreign_key_on_articles_table',1),(20,'2026_07_19_054016_backfill_article_category_ids',1),(21,'2026_07_20_071442_create_legal_documents_table',1),(22,'2026_07_20_082334_add_preferred_locale_to_users_table',1),(23,'2026_07_20_083431_rename_terms_key_to_member_agreement',1),(24,'2026_07_20_093143_add_id_document_back_path_to_members_table',1),(25,'2026_07_20_173141_create_contact_leads_table',1),(26,'2026_07_21_081531_create_properties_table',1),(27,'2026_07_21_081547_create_property_media_table',1),(28,'2026_07_21_120808_create_contacts_table',1),(29,'2026_07_22_164837_create_appointments_table',1),(30,'2026_07_23_072546_create_enquiries_table',1),(31,'2026_07_23_135742_create_teams_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint unsigned NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_price` decimal(12,2) NOT NULL,
  `daily_amount` decimal(12,2) DEFAULT NULL,
  `weekly_amount` decimal(12,2) DEFAULT NULL,
  `monthly_amount` decimal(12,2) DEFAULT NULL,
  `is_flexible` tinyint(1) NOT NULL DEFAULT '0',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plans_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plans`
--

LOCK TABLES `plans` WRITE;
/*!40000 ALTER TABLE `plans` DISABLE KEYS */;
INSERT INTO `plans` VALUES (1,'Starter Plan','starter',2000000.00,2500.00,15000.00,65000.00,1,0,1,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(2,'Growth Plan','growth',3000000.00,5000.00,25000.00,100000.00,1,0,2,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(3,'Advance Plan','advance',5000000.00,10000.00,50000.00,175000.00,1,1,3,1,'2026-07-24 08:31:24','2026-07-24 08:31:24'),(4,'Prime Plan','prime',10000000.00,10000.00,75000.00,300000.00,1,0,4,1,'2026-07-24 08:31:24','2026-07-24 08:31:24');
/*!40000 ALTER TABLE `plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` json NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city_id` bigint unsigned DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` bigint unsigned DEFAULT NULL,
  `price` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_value` decimal(12,2) DEFAULT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Available','Selling Fast','Reserved','Sold') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Available',
  `description` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `properties_slug_unique` (`slug`),
  KEY `properties_city_id_foreign` (`city_id`),
  KEY `properties_category_id_foreign` (`category_id`),
  CONSTRAINT `properties_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `properties_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property_media`
--

DROP TABLE IF EXISTS `property_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property_media` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `property_id` bigint unsigned NOT NULL,
  `type` enum('image','video') COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `caption` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `property_media_property_id_foreign` (`property_id`),
  CONSTRAINT `property_media_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property_media`
--

LOCK TABLES `property_media` WRITE;
/*!40000 ALTER TABLE `property_media` DISABLE KEYS */;
/*!40000 ALTER TABLE `property_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('C3XHUKYwSUL5l30LN3We6e70La0bcp2mY6GfPG49',1,'::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJnT3RDQXF2YVQ5Q1RqcVo1MDJqS21wMVFOclhyUWdRMHR1d3pKTk4zIiwidXJsIjpbXSwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9yb2NoZWxpXC90ZWFtLW1lbWJlcnMiLCJyb3V0ZSI6ImFkbWluLnRlYW0tbWVtYmVycy5pbmRleCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX0sImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjoxfQ==',1784887401),('MwF2sW0XeTLMB8qXn3ZkFH8IUjzPE7FzqcswWpTl',NULL,'::1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJ5elNmNm9iVmdDZnhZQnZIOTBZYjVJMzhuY0t3R3dKanN1WlBCbVhVIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvbG9jYWxob3N0OjgwMDBcLy53ZWxsLWtub3duXC9hcHBzcGVjaWZpY1wvY29tLmNocm9tZS5kZXZ0b29scy5qc29uIiwicm91dGUiOm51bGx9fQ==',1784887401);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_contents`
--

DROP TABLE IF EXISTS `site_contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_contents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `page` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'home',
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_contents_page_key_unique` (`page`,`key`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_contents`
--

LOCK TABLES `site_contents` WRITE;
/*!40000 ALTER TABLE `site_contents` DISABLE KEYS */;
INSERT INTO `site_contents` VALUES (1,'home','hero','{\"en\": {\"badge\": \"The Land Access Club — Cohort 12 Now Open\", \"subtitle\": \"Join the Land Access Club and take a structured path toward verified land and property ownership across Cameroon\'s most promising cities.\", \"heroImage\": \"\", \"titleLine1\": \"Own Land.\", \"titleLine2\": \"Build Wealth.\", \"titleAccent\": \"Secure Your Future.\", \"ctaPrimaryUrl\": \"/properties\", \"ctaPrimaryLabel\": \"Explore Properties\", \"ctaSecondaryUrl\": \"/land-access-club\", \"watchStoryLabel\": \"Watch the story\", \"statMembersLabel\": \"Member funding waitlist\", \"ctaSecondaryLabel\": \"Become a Member\", \"statPropertiesLabel\": \"Total acres managed\", \"statContributionsLabel\": \"Member contributions\"}, \"fr\": {\"badge\": \"Le Club d\'Accès au Terrain — Cohorte 12 ouverte\", \"subtitle\": \"Rejoignez le Land Access Club et suivez un parcours structuré vers la propriété foncière vérifiée dans les villes les plus prometteuses du Cameroun.\", \"heroImage\": \"\", \"titleLine1\": \"Possédez un terrain.\", \"titleLine2\": \"Bâtissez la richesse.\", \"titleAccent\": \"Sécurisez votre avenir.\", \"ctaPrimaryUrl\": \"/properties\", \"ctaPrimaryLabel\": \"Explorer les propriétés\", \"ctaSecondaryUrl\": \"/land-access-club\", \"watchStoryLabel\": \"Voir l\'histoire\", \"statMembersLabel\": \"Liste d\'attente des membres\", \"ctaSecondaryLabel\": \"Devenir membre\", \"statPropertiesLabel\": \"Total d\'hectares gérés\", \"statContributionsLabel\": \"Contributions des membres\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(2,'home','whyRocheli','{\"en\": {\"title\": \"Built like a bank.\", \"eyebrow\": \"Why Rocheli\", \"features\": [{\"icon\": \"ShieldCheck\", \"title\": \"Verified Properties\", \"description\": \"Every plot is title-audited, geo-mapped, and legally cleared before it reaches our members.\"}, {\"icon\": \"CalendarClock\", \"title\": \"Flexible Payment Plans\", \"description\": \"Structured monthly contributions built around your income, not the market.\"}, {\"icon\": \"FileLock\", \"title\": \"Secure Documentation\", \"description\": \"Digital land titles, registered deeds, and lifetime access to your ownership records.\"}, {\"icon\": \"Headset\", \"title\": \"Professional Support\", \"description\": \"A dedicated relationship manager guides you from contribution to allocation.\"}, {\"icon\": \"TrendingUp\", \"title\": \"Investment Growth\", \"description\": \"Our properties historically appreciate 12–20% annually across active corridors.\"}, {\"icon\": \"Building2\", \"title\": \"Property Management\", \"description\": \"Optional development, rental, and resale support — powered by our operations team.\"}], \"subtitle\": \"We combine fintech-grade rigor with real-estate craftsmanship to make ownership secure, transparent, and inevitable.\", \"titleAccent\": \"Trusted like family.\"}, \"fr\": {\"title\": \"Construit comme une banque.\", \"eyebrow\": \"Pourquoi Rocheli\", \"features\": [{\"icon\": \"ShieldCheck\", \"title\": \"Propriétés vérifiées\", \"description\": \"Chaque parcelle est auditée, géo-cartographiée et légalement dégagée avant d\'atteindre nos membres.\"}, {\"icon\": \"CalendarClock\", \"title\": \"Plans de paiement flexibles\", \"description\": \"Contributions mensuelles structurées selon vos revenus, pas selon le marché.\"}, {\"icon\": \"FileLock\", \"title\": \"Documentation sécurisée\", \"description\": \"Titres fonciers numériques, actes enregistrés et accès à vie à vos dossiers de propriété.\"}, {\"icon\": \"Headset\", \"title\": \"Support professionnel\", \"description\": \"Un gestionnaire de relation dédié vous accompagne de la contribution à l\'allocation.\"}, {\"icon\": \"TrendingUp\", \"title\": \"Croissance de l\'investissement\", \"description\": \"Nos propriétés s\'apprécient historiquement de 12 à 20% par an dans les corridors actifs.\"}, {\"icon\": \"Building2\", \"title\": \"Gestion immobilière\", \"description\": \"Support optionnel de développement, location et revente — assuré par notre équipe opérationnelle.\"}], \"subtitle\": \"Nous combinons la rigueur fintech avec le savoir-faire immobilier pour rendre la propriété sûre, transparente et inévitable.\", \"titleAccent\": \"De confiance comme une famille.\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(3,'home','savingsProgram','{\"en\": {\"image\": \"\", \"title\": \"A structured savings program\", \"eyebrow\": \"The Land Access Club\", \"ctaLabel\": \"Join membership\", \"features\": [\"Discounted access to premium inventory\", \"Priority allocation weekly wins\", \"Concierge relationship manager\", \"Free legal verification & title tracking\", \"Guaranteed buy-back on Prime tier\", \"Private member-only property drops\"], \"subtitle\": \"Contribute monthly at your pace. Reserve your plot from vetted inventory. Receive a legally registered land title — no shortcuts, no surprises.\", \"cohortLabel\": \"Cohort 12 · 84% allocated\", \"titleAccent\": \"that ends with a title in your name.\", \"secondaryCtaLabel\": \"See eligible inventory\"}, \"fr\": {\"image\": \"\", \"title\": \"Un programme d\'épargne structuré\", \"eyebrow\": \"Le Land Access Club\", \"ctaLabel\": \"Rejoindre l\'adhésion\", \"features\": [\"Accès à tarif réduit à l\'inventaire premium\", \"Allocation prioritaire chaque semaine\", \"Gestionnaire de relation dédié\", \"Vérification juridique gratuite et suivi du titre\", \"Rachat garanti sur le niveau Prime\", \"Offres foncières réservées aux membres\"], \"subtitle\": \"Contribuez mensuellement à votre rythme. Réservez votre parcelle parmi un inventaire vérifié. Recevez un titre foncier légalement enregistré — sans raccourcis, sans surprises.\", \"cohortLabel\": \"Cohorte 12 · 84% alloué\", \"titleAccent\": \"qui se termine par un titre à votre nom.\", \"secondaryCtaLabel\": \"Voir l\'inventaire éligible\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(4,'home','steps','{\"en\": {\"steps\": [{\"title\": \"Join the Club\", \"number\": \"01\", \"description\": \"Choose a contribution plan aligned with your goals — Starter, Growth, Advance or Prime.\"}, {\"title\": \"Contribute Monthly\", \"number\": \"02\", \"description\": \"Automated contributions build your allocation. Track everything from your dashboard.\"}, {\"title\": \"Reserve Property\", \"number\": \"03\", \"description\": \"Once eligible, reserve your plot from vetted inventory across active corridors.\"}, {\"title\": \"Own Your Land\", \"number\": \"04\", \"description\": \"Sign your registered deed, get your title, and step into ownership.\"}], \"title\": \"Four steps between you and\", \"eyebrow\": \"How it works\", \"titleAccent\": \"your land title.\"}, \"fr\": {\"steps\": [{\"title\": \"Rejoindre le Club\", \"number\": \"01\", \"description\": \"Choisissez un plan de contribution aligné avec vos objectifs — Starter, Growth, Advance ou Prime.\"}, {\"title\": \"Contribuer mensuellement\", \"number\": \"02\", \"description\": \"Des contributions automatisées construisent votre allocation. Suivez tout depuis votre tableau de bord.\"}, {\"title\": \"Réserver une propriété\", \"number\": \"03\", \"description\": \"Une fois éligible, réservez votre parcelle parmi un inventaire vérifié dans les corridors actifs.\"}, {\"title\": \"Posséder votre terrain\", \"number\": \"04\", \"description\": \"Signez votre acte enregistré, obtenez votre titre et entrez dans la propriété.\"}], \"title\": \"Quatre étapes entre vous et\", \"eyebrow\": \"Comment ça marche\", \"titleAccent\": \"votre titre foncier.\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(5,'home','testimonials','{\"en\": {\"title\": \"Real people.\", \"eyebrow\": \"Member stories\", \"subtitle\": \"Every quarter, hundreds of new members join the Club. Here are a few of their stories.\", \"titleAccent\": \"Real ownership.\"}, \"fr\": {\"title\": \"Des gens réels.\", \"eyebrow\": \"Témoignages des membres\", \"subtitle\": \"Chaque trimestre, des centaines de nouveaux membres rejoignent le Club. Voici quelques-unes de leurs histoires.\", \"titleAccent\": \"Une propriété réelle.\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(6,'home','faq','{\"en\": {\"title\": \"Everything you were wondering.\", \"eyebrow\": \"Questions\"}, \"fr\": {\"title\": \"Tout ce que vous vous demandiez.\", \"eyebrow\": \"Questions\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(7,'home','articles','{\"en\": {\"title\": \"Notes from the Rocheli desk\", \"eyebrow\": \"Latest insights\"}, \"fr\": {\"title\": \"Notes du bureau Rocheli\", \"eyebrow\": \"Dernières analyses\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(8,'home','cta','{\"en\": {\"phone\": \"+237 6XX XXX XXX\", \"title\": \"Talk to an advisor.\", \"address\": \"Ellig-Effa, Yaounde, Cameroon\", \"eyebrow\": \"Ready when you are\", \"ctaLabel\": \"Book my consultation\", \"whatsapp\": \"+237 6XX XXX XXX\", \"titleAccent\": \"Own land with confidence.\"}, \"fr\": {\"phone\": \"+237 6XX XXX XXX\", \"title\": \"Parlez à un conseiller.\", \"address\": \"Elig-Effa, Yaoundé, Cameroun\", \"eyebrow\": \"Prêt quand vous l\'êtes\", \"ctaLabel\": \"Réserver ma consultation\", \"whatsapp\": \"+237 6XX XXX XXX\", \"titleAccent\": \"Possédez un terrain en toute confiance.\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(9,'home','footer','{\"en\": {\"email\": \"hello@rocheli.com\", \"phone\": \"+237 6XX XXX XXX\", \"address\": \"Ellig-Effa, Yaounde, Cameroon\", \"twitterUrl\": \"\", \"description\": \"A trusted real-estate savings platform helping members across Cameroon build wealth through verified land and property ownership.\", \"facebookUrl\": \"\", \"linkedinUrl\": \"\", \"instagramUrl\": \"\"}, \"fr\": {\"email\": \"hello@rocheli.com\", \"phone\": \"+237 6XX XXX XXX\", \"address\": \"Elig-Effa, Yaoundé, Cameroun\", \"twitterUrl\": \"\", \"description\": \"Une plateforme d\'épargne immobilière de confiance aidant les membres à travers le Cameroun à bâtir la richesse grâce à la propriété foncière vérifiée.\", \"facebookUrl\": \"\", \"linkedinUrl\": \"\", \"instagramUrl\": \"\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(10,'about','hero','{\"en\": {\"title\": \"Building the trusted\", \"eyebrow\": \"Our story\", \"description\": \"Rocheli was born from a simple observation: land ownership in Cameroon should be secure, structured and accessible — not a maze. We built a platform, a legal engine, and a members\' club to make it so.\", \"titleAccent\": \"bridge to land in Cameroon.\"}, \"fr\": {\"title\": \"Construire le pont de confiance\", \"eyebrow\": \"Notre histoire\", \"description\": \"Rocheli est né d\'un constat simple : la propriété foncière au Cameroun devrait être sûre, structurée et accessible — pas un labyrinthe. Nous avons construit une plateforme, un moteur juridique et un club de membres pour y parvenir.\", \"titleAccent\": \"vers la terre au Cameroun.\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(11,'about','story','{\"en\": {\"image\": \"/family-land.jpg\", \"title\": \"From a small team of\", \"eyebrow\": \"Company story\", \"paragraph1\": \"Founded in Douala in 2019, Rocheli started with 12 members and one 5-hectare parcel. Today we manage 15,000 acres across Douala, Yaoundé, Kribi, Buea and Bafoussam — and have transferred more than 2,000 land titles into member hands.\", \"paragraph2\": \"Our conviction is unchanged: verified land, structured savings and radical transparency are the shortest path to generational wealth in Central Africa.\", \"titleAccent\": \"believers to a movement of 50+ members.\"}, \"fr\": {\"image\": \"/family-land.jpg\", \"title\": \"D\'une petite équipe de\", \"eyebrow\": \"Histoire de l\'entreprise\", \"paragraph1\": \"Fondée à Douala en 2019, Rocheli a débuté avec 12 membres et une parcelle de 5 hectares. Aujourd\'hui, nous gérons 15 000 hectares à Douala, Yaoundé, Kribi, Buea et Bafoussam — et avons transféré plus de 2 000 titres fonciers entre les mains de nos membres.\", \"paragraph2\": \"Notre conviction reste inchangée : un terrain vérifié, une épargne structurée et une transparence radicale sont le chemin le plus court vers une richesse générationnelle en Afrique centrale.\", \"titleAccent\": \"croyants à un mouvement de plus de 50 membres.\"}}','2026-07-24 08:31:24','2026-07-24 08:32:26'),(12,'about','mission','{\"en\": {\"values\": [{\"body\": \"Make verified land ownership accessible to every ambitious Cameroonian through structured, transparent programs.\", \"icon\": \"Target\", \"title\": \"Mission\"}, {\"body\": \"A generation of African families whose wealth is anchored in land they legally, unquestionably own.\", \"icon\": \"Eye\", \"title\": \"Vision\"}, {\"body\": \"Integrity above expedience. Transparency by default. Excellence at every touchpoint. Members before margins.\", \"icon\": \"Heart\", \"title\": \"Values\"}]}, \"fr\": {\"values\": [{\"body\": \"Rendre la propriété foncière vérifiée accessible à tout Camerounais ambitieux grâce à des programmes structurés et transparents.\", \"icon\": \"Target\", \"title\": \"Mission\"}, {\"body\": \"Une génération de familles africaines dont la richesse repose sur des terres qu\'elles possèdent légalement et incontestablement.\", \"icon\": \"Eye\", \"title\": \"Vision\"}, {\"body\": \"L\'intégrité avant l\'opportunisme. La transparence par défaut. L\'excellence à chaque étape. Les membres avant les marges.\", \"icon\": \"Heart\", \"title\": \"Valeurs\"}]}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(13,'about','leadership','{\"en\": {\"title\": \"The people building Rocheli\", \"eyebrow\": \"Leadership\", \"description\": \"A senior team spanning real estate, law, finance and technology.\"}, \"fr\": {\"title\": \"Les personnes qui construisent Rocheli\", \"eyebrow\": \"Direction\", \"description\": \"Une équipe expérimentée couvrant l\'immobilier, le droit, la finance et la technologie.\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(14,'services','hero','{\"en\": {\"title\": \"A full real-estate stack,\", \"eyebrow\": \"Services\", \"description\": \"From your first plot to a multi-asset portfolio — Rocheli\'s teams handle the sales, legal, management and advisory work end-to-end.\", \"titleAccent\": \"under one roof.\"}, \"fr\": {\"title\": \"Une offre immobilière complète,\", \"eyebrow\": \"Services\", \"description\": \"De votre première parcelle à un portefeuille multi-actifs — les équipes de Rocheli gèrent la vente, le juridique, la gestion et le conseil de bout en bout.\", \"titleAccent\": \"sous un même toit.\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(15,'services','list','{\"en\": {\"items\": [{\"body\": \"Curated inventory of title-verified plots in Cameroon\'s fastest-growing corridors, ready for outright or structured purchase.\", \"icon\": \"Landmark\", \"title\": \"Land Sales\", \"points\": [{\"text\": \"Title-audited plots\"}, {\"text\": \"Installment options\"}, {\"text\": \"Legal handover\"}]}, {\"body\": \"Turnkey management of your land or built asset — from perimeter security and maintenance to leasing and reporting.\", \"icon\": \"Building2\", \"title\": \"Property Management\", \"points\": [{\"text\": \"Security & upkeep\"}, {\"text\": \"Tenant handling\"}, {\"text\": \"Monthly reports\"}]}, {\"body\": \"Independent legal audit of any land title, deed or purchase agreement. Know exactly what you\'re signing.\", \"icon\": \"BadgeCheck\", \"title\": \"Title Verification\", \"points\": [{\"text\": \"Land Conservation checks\"}, {\"text\": \"Boundary survey\"}, {\"text\": \"Encumbrance report\"}]}, {\"body\": \"Strategic guidance for individuals, family offices and institutions deploying capital into Cameroonian real estate.\", \"icon\": \"LineChart\", \"title\": \"Investment Advisory\", \"points\": [{\"text\": \"Portfolio design\"}, {\"text\": \"Deal sourcing\"}, {\"text\": \"Exit planning\"}]}, {\"body\": \"Long-term stewardship of real-estate portfolios with reporting, tax structuring and value-optimisation.\", \"icon\": \"Briefcase\", \"title\": \"Asset Management\", \"points\": [{\"text\": \"Reporting suite\"}, {\"text\": \"Tax optimisation\"}, {\"text\": \"Value engineering\"}]}, {\"body\": \"Bespoke consulting for developers, corporates and public institutions on land, housing and infrastructure projects.\", \"icon\": \"ShieldCheck\", \"title\": \"Real Estate Consulting\", \"points\": [{\"text\": \"Feasibility studies\"}, {\"text\": \"Master planning\"}, {\"text\": \"Public-private partnerships\"}]}]}, \"fr\": {\"items\": [{\"body\": \"Inventaire sélectionné de parcelles à titre vérifié dans les corridors camerounais à plus forte croissance, prêtes pour un achat comptant ou structuré.\", \"icon\": \"Landmark\", \"title\": \"Vente de terrains\", \"points\": [{\"text\": \"Parcelles auditées\"}, {\"text\": \"Options de paiement échelonné\"}, {\"text\": \"Remise juridique\"}]}, {\"body\": \"Gestion clé en main de votre terrain ou bien bâti — de la sécurité périmétrique et l\'entretien à la location et aux rapports.\", \"icon\": \"Building2\", \"title\": \"Gestion immobilière\", \"points\": [{\"text\": \"Sécurité et entretien\"}, {\"text\": \"Gestion des locataires\"}, {\"text\": \"Rapports mensuels\"}]}, {\"body\": \"Audit juridique indépendant de tout titre foncier, acte ou accord d\'achat. Sachez exactement ce que vous signez.\", \"icon\": \"BadgeCheck\", \"title\": \"Vérification de titre\", \"points\": [{\"text\": \"Vérifications au Conservateur foncier\"}, {\"text\": \"Levé de bornage\"}, {\"text\": \"Rapport de charges\"}]}, {\"body\": \"Accompagnement stratégique pour particuliers, family offices et institutions déployant du capital dans l\'immobilier camerounais.\", \"icon\": \"LineChart\", \"title\": \"Conseil en investissement\", \"points\": [{\"text\": \"Conception de portefeuille\"}, {\"text\": \"Sourcing de transactions\"}, {\"text\": \"Planification de sortie\"}]}, {\"body\": \"Gestion à long terme de portefeuilles immobiliers avec reporting, structuration fiscale et optimisation de la valeur.\", \"icon\": \"Briefcase\", \"title\": \"Gestion d\'actifs\", \"points\": [{\"text\": \"Suite de reporting\"}, {\"text\": \"Optimisation fiscale\"}, {\"text\": \"Ingénierie de la valeur\"}]}, {\"body\": \"Conseil sur mesure pour promoteurs, entreprises et institutions publiques sur les projets fonciers, de logement et d\'infrastructure.\", \"icon\": \"ShieldCheck\", \"title\": \"Conseil immobilier\", \"points\": [{\"text\": \"Études de faisabilité\"}, {\"text\": \"Planification directrice\"}, {\"text\": \"Partenariats public-privé\"}]}]}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(16,'services','cta','{\"en\": {\"title\": \"Not sure which service fits?\", \"titleAccent\": \"Talk to us.\", \"ctaPrimaryLabel\": \"Book a consultation\", \"ctaSecondaryLabel\": \"See live inventory\"}, \"fr\": {\"title\": \"Vous ne savez pas quel service choisir ?\", \"titleAccent\": \"Parlez-nous-en.\", \"ctaPrimaryLabel\": \"Réserver une consultation\", \"ctaSecondaryLabel\": \"Voir l\'inventaire en direct\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(17,'land-club','hero','{\"en\": {\"title\": \"Save monthly.\", \"eyebrow\": \"The Land Access Club\", \"description\": \"A fintech-grade savings program that ends with a legally registered land title in your name — no lotteries, no shortcuts, no surprises.\", \"titleAccent\": \"Own land for life.\", \"ctaPrimaryLabel\": \"Start my membership\", \"ctaSecondaryLabel\": \"Browse eligible properties\"}, \"fr\": {\"title\": \"Épargnez chaque mois.\", \"eyebrow\": \"Le Land Access Club\", \"description\": \"Un programme d\'épargne de niveau fintech qui se termine par un titre foncier légalement enregistré à votre nom — sans loterie, sans raccourci, sans surprise.\", \"titleAccent\": \"Possédez un terrain à vie.\", \"ctaPrimaryLabel\": \"Démarrer mon adhésion\", \"ctaSecondaryLabel\": \"Parcourir les propriétés éligibles\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(18,'land-club','benefits','{\"en\": {\"items\": [{\"body\": \"Every property in the Club is legally cleared before allocation.\", \"icon\": \"ShieldCheck\", \"title\": \"Verified inventory\"}, {\"body\": \"Members receive first look at every new development launch.\", \"icon\": \"Sparkles\", \"title\": \"Priority access\"}, {\"body\": \"Contribute monthly at your pace, without financial pressure.\", \"icon\": \"Landmark\", \"title\": \"Structured savings\"}, {\"body\": \"Join 5,000+ Cameroonians building generational wealth together.\", \"icon\": \"Users\", \"title\": \"Community\"}], \"title\": \"Benefits designed like a private bank.\", \"eyebrow\": \"Why join\"}, \"fr\": {\"items\": [{\"body\": \"Chaque propriété du Club est légalement dégagée avant allocation.\", \"icon\": \"ShieldCheck\", \"title\": \"Inventaire vérifié\"}, {\"body\": \"Les membres ont un premier regard sur chaque nouveau lancement.\", \"icon\": \"Sparkles\", \"title\": \"Accès prioritaire\"}, {\"body\": \"Contribuez mensuellement à votre rythme, sans pression financière.\", \"icon\": \"Landmark\", \"title\": \"Épargne structurée\"}, {\"body\": \"Rejoignez plus de 5 000 Camerounais qui bâtissent une richesse générationnelle ensemble.\", \"icon\": \"Users\", \"title\": \"Communauté\"}], \"title\": \"Des avantages conçus comme une banque privée.\", \"eyebrow\": \"Pourquoi adhérer\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(19,'land-club','journey','{\"en\": {\"items\": [{\"body\": \"Choose a plan, verify identity, sign the member agreement.\", \"month\": \"Month 0\", \"title\": \"Sign up & KYC\"}, {\"body\": \"Automated monthly contribution begins. Track everything in-app.\", \"month\": \"Month 1\", \"title\": \"First contribution\"}, {\"body\": \"Once eligible, reserve your plot from vetted inventory.\", \"month\": \"Month 6+\", \"title\": \"Reservation window\"}, {\"body\": \"Sign your registered land title and receive your deed.\", \"month\": \"Final month\", \"title\": \"Title transfer\"}], \"title\": \"Your path from savings to signed title.\", \"eyebrow\": \"Membership journey\"}, \"fr\": {\"items\": [{\"body\": \"Choisissez un plan, vérifiez votre identité, signez l\'accord de membre.\", \"month\": \"Mois 0\", \"title\": \"Inscription et KYC\"}, {\"body\": \"La contribution mensuelle automatisée commence. Suivez tout dans l\'application.\", \"month\": \"Mois 1\", \"title\": \"Première contribution\"}, {\"body\": \"Une fois éligible, réservez votre parcelle parmi l\'inventaire vérifié.\", \"month\": \"Mois 6+\", \"title\": \"Fenêtre de réservation\"}, {\"body\": \"Signez votre titre foncier enregistré et recevez votre acte.\", \"month\": \"Dernier mois\", \"title\": \"Transfert du titre\"}], \"title\": \"Votre chemin de l\'épargne au titre signé.\", \"eyebrow\": \"Parcours d\'adhésion\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(20,'land-club','eligibility','{\"en\": {\"title\": \"Simple, transparent requirements.\", \"eyebrow\": \"Eligibility\", \"requirements\": [{\"text\": \"Cameroonian or resident foreign national\"}, {\"text\": \"18 years or older\"}, {\"text\": \"Valid national ID or passport\"}, {\"text\": \"Verifiable source of monthly income\"}, {\"text\": \"Active phone number & email\"}, {\"text\": \"Signed member agreement\"}]}, \"fr\": {\"title\": \"Des conditions simples et transparentes.\", \"eyebrow\": \"Éligibilité\", \"requirements\": [{\"text\": \"Camerounais ou étranger résident\"}, {\"text\": \"18 ans ou plus\"}, {\"text\": \"Carte d\'identité nationale ou passeport valide\"}, {\"text\": \"Source de revenu mensuel vérifiable\"}, {\"text\": \"Numéro de téléphone et email actifs\"}, {\"text\": \"Accord de membre signé\"}]}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(21,'resources','hero','{\"en\": {\"title\": \"Everything you need to\", \"eyebrow\": \"Knowledge hub\", \"description\": \"Guides, videos, market reports and downloads written by Rocheli\'s real estate, legal and finance teams.\", \"titleAccent\": \"buy, own, grow.\"}, \"fr\": {\"title\": \"Tout ce qu\'il vous faut pour\", \"eyebrow\": \"Centre de ressources\", \"description\": \"Guides, vidéos, rapports de marché et téléchargements rédigés par les équipes immobilier, juridique et finance de Rocheli.\", \"titleAccent\": \"acheter, posséder, développer.\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(22,'resources','featured','{\"en\": {\"title\": \"Editor\'s picks this month\", \"eyebrow\": \"Featured\"}, \"fr\": {\"title\": \"Les sélections du mois\", \"eyebrow\": \"À la une\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(23,'resources','articles','{\"en\": {\"title\": \"From the Rocheli desk\", \"eyebrow\": \"Latest articles\"}, \"fr\": {\"title\": \"Depuis le bureau Rocheli\", \"eyebrow\": \"Derniers articles\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(24,'contact','hero','{\"en\": {\"title\": \"Let\'s talk about your\", \"eyebrow\": \"Contact us\", \"description\": \"Book a 30-minute consultation with an advisor. Visit our office. Or ping us on WhatsApp — whichever works for you.\", \"titleAccent\": \"first plot.\"}, \"fr\": {\"title\": \"Parlons de votre\", \"eyebrow\": \"Contactez-nous\", \"description\": \"Réservez une consultation de 30 minutes avec un conseiller. Visitez notre bureau. Ou contactez-nous sur WhatsApp — comme vous préférez.\", \"titleAccent\": \"première parcelle.\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(25,'contact','form','{\"en\": {\"title\": \"Send us a message\", \"subtitle\": \"We\'ll respond within one business day.\"}, \"fr\": {\"title\": \"Envoyez-nous un message\", \"subtitle\": \"Nous répondrons dans un jour ouvrable.\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(26,'contact','booking','{\"en\": {\"body\": \"Pick a 30-minute slot with a Rocheli advisor. Available Mon–Sat.\", \"title\": \"Book an advisor\"}, \"fr\": {\"body\": \"Choisissez un créneau de 30 minutes avec un conseiller Rocheli. Disponible du lundi au samedi.\", \"title\": \"Réserver un conseiller\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(27,'contact','whatsapp','{\"en\": {\"title\": \"Chat on WhatsApp\", \"subtitle\": \"Response time under 15 minutes · 8am – 8pm\"}, \"fr\": {\"title\": \"Discuter sur WhatsApp\", \"subtitle\": \"Temps de réponse inférieur à 15 minutes · 8h – 20h\"}}','2026-07-24 08:31:24','2026-07-24 08:31:24'),(28,'contact','offices','{\"en\": {\"items\": [{\"city\": \"Yaoundé\", \"hours\": \"Mon–Fri · 8am – 5pm\", \"phone\": \"+237 6 55 11 11 11\", \"address\": \"Chapelle Elig-Effa\"}]}, \"fr\": {\"items\": [{\"city\": \"Yaoundé\", \"hours\": \"Lun–Ven · 8h – 17h\", \"phone\": \"+237 6 55 11 11 11\", \"address\": \"Chapelle Elig-Effa\"}]}}','2026-07-24 08:31:24','2026-07-24 08:31:24');
/*!40000 ALTER TABLE `site_contents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` json NOT NULL,
  `position` json NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `order` int unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (1,'{\"en\": \"Rochi Boss\", \"fr\": \"Rocheli Boss\"}','{\"en\": \"CEO\", \"fr\": \"PDG\"}','team-members/aLedTaD9mvCpOpSWWpjF6QrVH4oNMZOxGJYTfLOo.jpg',0,'2026-07-24 08:45:49','2026-07-24 08:45:49'),(2,'{\"en\": \"Buesi BB\", \"fr\": \"Buesi BB\"}','{\"en\": \"CFO\", \"fr\": \"CFO\"}','team-members/9xG1lfmZwAAgoUxfdkx3VCQ3nq5RsRYhgReU8ZKb.jpg',1,'2026-07-24 08:49:38','2026-07-24 08:49:38');
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` json NOT NULL,
  `quote` json NOT NULL,
  `rating` tinyint unsigned NOT NULL DEFAULT '5',
  `avatar_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_published` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES (1,'Amina Nkeng','{\"en\": \"Growth Plan Member · Yaoundé\", \"fr\": \"Membre Growth Plan · Yaoundé\"}','{\"en\": \"I started with FCFA 50,000 monthly. Two years later I received my land title. Rocheli made ownership feel almost effortless.\", \"fr\": \"J\'ai commencé avec 50 000 FCFA par mois. Deux ans plus tard, j\'ai reçu mon titre foncier. Rocheli a rendu la propriété presque sans effort.\"}',5,NULL,1,1,'2026-07-24 08:31:24','2026-07-24 08:31:24');
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `role` enum('admin','member') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'member',
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_verified_at` timestamp NULL DEFAULT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferred_locale` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'en',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_phone_unique` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'System Administrator','rochelientreprise@gmail.com','2026-07-24 08:31:24','admin','670000000',NULL,'female','en','$2y$12$./UclgQ3WHNsp.YVsFtOw.T7Mwy8Bcw2Rof5tvZct3RvHYl.lMAzq','aFLepq2Pz4L3vaBuu2prGPDiX1XYw1ioimVI8J2IsXWk8Vn0tcXeEajM6rwh','2026-07-24 08:31:24','2026-07-24 08:31:24');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-24 11:03:23
