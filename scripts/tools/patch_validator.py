#!/usr/bin/env python3
import sys
import ast

def validate_code(file_path):
    if file_path.endswith('.py'):
        try:
            with open(file_path, 'r') as f:
                ast.parse(f.read())
            return True, "Syntaxe Python valide."
        except Exception as e:
            return False, f"Erreur de syntaxe Python: {e}"
    elif file_path.endswith('.js'):
        # Basique pour JS (vérification via node)
        return True, "Validation JS à implémenter via node -c."
    return True, "Format non supporté pour validation auto."

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: patch_validator.py <file_path>")
        sys.exit(1)
    
    ok, msg = validate_code(sys.argv[1])
    print(msg)
    sys.exit(0 if ok else 1)
