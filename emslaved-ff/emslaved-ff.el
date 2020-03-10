;; attempt to connect the emslaved webextension to emacs using websockets
;; im thinking this is nicer than bridging with a python thing

;;; Code:
(setq emslaved-ff-websocket
      (websocket-server 9000
                        :on-open    #'emslaved-ff-on-open
                        :on-message #'emslaved-ff-on-message
                        :on-error   #'emslaved-ff-on-error
                        :on-close  #'emslaved-ff-on-close
                        ))

;;(websocket-close emslaved-ff-websocket)

;;(websocket-send-text emslaved-ff-client-websocket "hello from emacs!!!")
;;(websocket-send-text emslaved-ff-client-websocket "console.log('this is evaled string from emacs')")

;;(websocket-send-text emslaved-ff-client-websocket "forceBlock()")
;;(websocket-send-text emslaved-ff-client-websocket "forceUnblock()")

(defun emslaved-ff-on-open (websocket)
  (message "emslaved-ff-on-open %s" websocket)
  (setq emslaved-ff-client-websocket websocket) ;;this asumes only 1 client atm
  )

(defun emslaved-ff-on-message (websocket websocket-frame)
  (message "emslaved-ff-on-message %s %s" websocket websocket-frame)

  )

(defun emslaved-ff-on-close (websocket )
  (message "emslaved-ff-on-close %s" websocket))


(defun emslaved-ff-on-error (websocket sym err )
  (message "emslaved-ff-on-close %s %s %s" websocket sym err))

