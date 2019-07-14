#!/bin/sh
echo "started v2: $1 $2 $3 $4 $5" > /tmp/emslaved-sh.log
while true
      do
          read -n4 -p "emslaved.sh:" msg
          echo $msg
          echo "msg: $msg" >> /tmp/emslaved-sh.log
done
