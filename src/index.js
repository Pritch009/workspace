import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "./router";
import './global.css'

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Router />);
