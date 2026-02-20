# === Configuration Centrale ===
set ssh_host "76.13.32.171"
set ssh_user "root"
set ssh_pass "Camboui2004."
set docker_container "3f16f43cfe5e"
set remote_root "/data/.openclaw"
set remote_workspace "/data/.openclaw/workspace"

# === Utilitaires ===
# Fonction pour se connecter au VPS
proc ssh_login {user host pass} {
    spawn ssh $user@$host
    expect {
        "password:" {
            send "$pass\r"
        }
        "(yes/no)?" {
            send "yes\r"
            expect "password:"
            send "$pass\r"
        }
    }
}
