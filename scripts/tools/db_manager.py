#!/usr/bin/env python3
import sqlite3
import json
import sys
import os

def create_temp_db(data_path, table_name):
    conn = sqlite3.connect(':memory:')
    # Logique d'importation auto à développer selon le format
    return "Base de données en mémoire créée."

if __name__ == "__main__":
    print("DB Manager prêt pour l'analyse de données.")
