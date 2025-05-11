# 🕵️ SOCIALDETECTIVE: A Web-Based Forensic Tool Using NLP for Social Media Investigations

## 📌 Overview

**SOCIALDETECTIVE** is a web-based forensic tool designed to assist digital investigators in acquiring, analyzing, and managing social media content for investigations. This tool focuses on **Twitter** and **Instagram**, providing an end-to-end workflow—from data collection and evidence hashing to NLP-based analysis and reporting.

It supports two user roles:  
- **Investigator (Analyst):** Can upload data, analyze content, and generate forensic reports.  
- **Admin:** Can manage users, oversee system activities, and ensure evidence compliance.

---

## 🎯 Objectives

- Accept and normalize raw data from Twitter and Instagram datasets.
- Detect malicious content (e.g., hate speech, threats) using NLP.
- Ensure evidence integrity through hashing, write protection, and audit trails.
- Provide dashboards for analysis and system administration.
- Generate forensic and compliance reports.

---

## 🖥️ System Architecture

### Analyst Workflow
- 🗂️ **Upload Interface:** Analysts can upload JSON/text files containing social media data (tweets, captions, metadata).
- 📥 **Data Ingestion:** Accepts dataset files exported from Twitter/Instagram or third-party archives.
- 🔐 **Evidence Hashing:** SHA256 hashing for metadata and media files.
- 🧱 **Write Protection:** Read-only tagging, access control layers.
- 📜 **Chain of Custody:** Timestamped logs, analyst ID, source tracking.
- 🧠 **NLP Analysis:**
  - Text normalization
  - Sentiment analysis
  - Threat/hate speech detection
  - Tagging and correlation
- 📤 **Export Forensic Reports:** Metadata, timeline, visualizations, logs.

### Admin Workflow
- 👥 **User & System Management:**
  - Add/manage users
  - Assign roles
  - View audit trails and system logs
- 🛡️ **Evidence Control:**
  - Approve/reject deletions
  - Validate hashes and evidence integrity
- 📑 **Compliance & Reporting:**
  - Manage data retention policies
  - Role-based access controls
  - Generate admin reports (evidence summary, user logs)

---

## 📊 Datasets

SOCIALDETECTIVE uses publicly available and synthetically created datasets to support model training and analysis tasks. These datasets include:

### ✅ Twitter Dataset
- Format: JSON
- Includes tweets, user metadata, hashtags, timestamps
- Pre-annotated or labeled for hate speech, sentiment, or threat detection (e.g., HateXplain, TweetEval)

### ✅ Instagram Dataset
- Format: Exported JSON or CSV
- Includes captions, tags, comment threads, and media metadata
- Curated for NLP tasks like sentiment and topic detection

### ✅ Custom Synthetic Dataset
- For sensitive forensic testing, anonymized and synthetic datasets are generated to simulate realistic case scenarios without violating user privacy.

> 📝 Note: All datasets are processed offline and uploaded via the investigator dashboard to ensure controlled acquisition and reproducibility in forensic workflows.

---

## ⚙️ Tech Stack

### 🧩 Frontend
- React.js (Material Kit React + Material Tailwind Dashboard)
- Context API (for auth state)
- JWT Authentication
- File upload interface, tagging, and dashboards

### 🛠️ Backend
- Django + Django Rest Framework (DRF)
- PostgreSQL Database
- REST API for frontend integration
- Role-based login redirection (investigator to dashboard, admin to Django admin panel)

### 🤖 NLP & AI
- Hugging Face Transformers
- PyTorch
- NLTK or spaCy (text preprocessing)
- Custom models for sentiment & threat detection

### ☁️ Cloud Services (Planned)
- **AWS S3**: Evidence storage
- **AWS IAM**: Role-based access & policy enforcement

---

## ✅ Features (Planned and In Progress)

| Feature                         | Status        |
|----------------------------------|---------------|
| React Dashboard with Auth        | ✅ In Progress |
| Django API for Text Normalization| ✅ In Progress |
| File Upload + Evidence Logging   | 🔄 Planned     |
| Text Normalization Module        | ✅ In Progress |
| NLP Analysis Module              | 🔄 Planned     |
| Chain of Custody Logging         | 🔄 Planned     |
| Admin User Management            | 🔄 Planned     |
| Role-Based Login Redirection     | ✅ Completed   |
| Forensic Report Export           | 🔄 Planned     |

---


## 🏗️ Project Setup (Local)

```bash
# Backend
cd backend/
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver

# Frontend
cd frontend/
npm install
npm start
