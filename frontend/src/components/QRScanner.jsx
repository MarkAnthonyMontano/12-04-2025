// src/components/QRScanner.jsx
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/*
 Props:
  - open (bool)
  - onClose()  -> called when dialog closes
  - onScan(text) -> called when QR code text is read
*/
export default function QRScanner({ open, onClose, onScan }) {
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);
  const [cameraId, setCameraId] = useState(null);

  useEffect(() => {
    if (!open) return;

    let mounted = true;

    (async () => {
      try {
        // Get cameras
        const devices = await Html5Qrcode.getCameras();
        if (!mounted) return;

        // prefer back camera when available
        const back = devices.find((d) => /back|rear|environment/i.test(d.label));
        const chosen = back || devices[0];
        setCameraId(chosen?.id || null);

        // create scanner instance
        html5QrRef.current = new Html5Qrcode(scannerRef.current.id || "qr-reader");

        await html5QrRef.current.start(
          chosen?.id || { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 300, height: 300 },
            disableFlip: false,
          },
          (decodedText) => {
            // ✅ Only pass value, don't stop here
            if (onScan) onScan(decodedText);
            if (onClose) onClose();
          },
          () => {
            // ignore frequent no-read errors
          }
        );
      } catch (err) {
        console.error("QR init error:", err);
      }
    })();

    return () => {
      mounted = false;
      if (html5QrRef.current) {
        const stopResult = html5QrRef.current.stop();

        if (stopResult && typeof stopResult.then === "function") {
          // stop() returned a promise
          stopResult
            .catch((err) => {
              if (!String(err).includes("not running")) {
                console.warn("QR stop error:", err);
              }
            })
            .finally(() => {
              html5QrRef.current
                ?.clear()
                .catch(() => { })
                .finally(() => {
                  html5QrRef.current = null;
                });
            });
        } else {
          // stop() was sync or undefined
          try {
            html5QrRef.current.clear();
          } catch (e) { }
          html5QrRef.current = null;
        }
      }
    };

  }, [open, onScan, onClose]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Scan QR Code
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          id="qr-reader-wrapper"
          sx={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          {/* The scanner will attach itself to this container */}
          <div
            id="qr-reader"
            ref={scannerRef}
            style={{ width: "100%", maxWidth: 420 }}
          />
        </Box>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => {
              onClose && onClose(); // cleanup useEffect will stop it
            }}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
