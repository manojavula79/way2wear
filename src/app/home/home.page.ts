import { Component, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { generateOutfitRecommendation, OutfitResponse } from '../services/ai-stylist';

interface Message {
  role: 'user' | 'assistant';
  text?: string;
  outfit?: OutfitResponse;
  products?: any[];
  loading?: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  @ViewChild(IonContent) content!: IonContent;
  
  message: string = '';
  chatHistory: Message[] = [];
  isStyling: boolean = false;

  constructor() {}

  async sendMessage() {
    if (!this.message.trim() || this.isStyling) return;

    const userPrompt = this.message;
    this.message = '';
    
    // Add user message
    this.chatHistory.push({ role: 'user', text: userPrompt });
    this.scrollToBottom();

    // Add assistant loading state
    this.isStyling = true;
    const loadingMsg: Message = { role: 'assistant', loading: true };
    this.chatHistory.push(loadingMsg);
    this.scrollToBottom();

    try {
      // 1. Generate Outfit via Gemini
      const outfit = await generateOutfitRecommendation(userPrompt);
      
      // 2. Match Products via Backend
      const response = await fetch('http://localhost:8000/api/products/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outfit })
      });
      const { matches } = await response.json();

      // Update loading message with results
      loadingMsg.loading = false;
      loadingMsg.outfit = outfit;
      loadingMsg.products = matches;
      
    } catch (error) {
      console.error('Styling failed:', error);
      loadingMsg.loading = false;
      loadingMsg.text = "Sorry, I couldn't style that look right now. Please try again!";
    } finally {
      this.isStyling = false;
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 100);
  }
}
