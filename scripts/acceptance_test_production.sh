#! /usr/bin/env bash
# Production acceptance test for medcheck application
# 2016

# domain and application information
app_host="herokuapp.com"
app_hostname="cs361-medcheck.herokuapp.com"
app_url="https://$app_hostname"

printf "\nAcceptance Testing: Medcheck\n"

# Check host
printf "\nApplication Hosting Test: "
printf "herokuapp.com blocks ICMP requests.\n Check manually, or use route test.\n\n"

# ping tests are blocked, uncomment for hosts that allow ICMP packets
# ping -c 1 "$app_host"; echo $?
# ping -c 1 "$app_hostname"; echo $?

# Check routes
printf "Application Route Test:\n\n"

# Use curl to check routes, look for 200 and OK status.
# Root route is checked, and one other common user route.
printf "Application entry point: "
curl -Is "$app_url" | head -n 1

printf "Login route: "
curl -Is "$app_url" | head -n 1
