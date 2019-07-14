#!/bin/sh
sudo iptables $1 OUTPUT -p tcp -m string --string "manga" --algo kmp -j REJECT
sudo iptables $1 OUTPUT -p tcp -m string --string "nytimes.com" --algo kmp -j REJECT
sudo iptables $1 OUTPUT -p tcp -m string --string "svd.se" --algo kmp -j REJECT
sudo iptables $1 OUTPUT -p tcp -m string --string "www.dn.se" --algo kmp -j REJECT
sudo iptables $1 OUTPUT -p tcp -m string --string "penny-arcade.com" --algo kmp -j REJECT
sudo iptables $1 OUTPUT -p tcp -m string --string "smbc-comics.com" --algo kmp -j REJECT
