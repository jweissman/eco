// Array.prototype.choice = function() {
//   var i = floor(random(this.length));
//   return this[i];
// }

import { sample } from "./sample";

// A MarkovGenerate object
export class MarkovGenerator {
  constructor(private n: number, private max: number) {}
  // Order (or length) of each ngram
  // this.n = n;
  // // What is the maximum amount we will generate?
  // this.max = max;
  // An object as dictionary
  // each ngram is the key, a list of possible next elements are the values
  ngrams: { [key: string]: string[] } = {};
  // A separate array of possible beginnings to generated text
  beginnings: string[] = [];

  // A function to feed in text to the markov chain
  feed(text: string) {

    // Discard this line if it's too short
    if (text.length < this.n) {
      return false;
    }

    // Store the first ngram of this line
    let beginning = text.substring(0, this.n);
    this.beginnings.push(beginning);

    // Now let's go through everything and create the dictionary
    for (var i = 0; i < text.length - this.n; i++) {
      let gram = text.substring(i, i + this.n);
      let next = text.charAt(i + this.n);
      // Is this a new one?
      if (!this.ngrams.hasOwnProperty(gram)) {
        this.ngrams[gram] = [];
      }
      // Add to the list
      this.ngrams[gram].push(next);
    }
  }

  // Generate a text from the information ngrams
  generate() {

    // Get a random  beginning
    let current = sample(this.beginnings) //.choice();
    let output = current;

    // Generate a new token max number of times
    for (var i = 0; i < this.max; i++) {
      // If this is a valid ngram
      if (this.ngrams.hasOwnProperty(current)) {
        // What are all the possible next tokens
        let possible_next = this.ngrams[current];
        // Pick one randomly
        let next = sample(possible_next) //.choice();
        // Add to the output
        output += next;
        // Get the last N entries of the output; we'll use this to look up
        // an ngram in the next iteration of the loop
        current = output.substring(output.length - this.n, output.length);
      } else {
        break;
      }
    }
    // Here's what we got!
    return output;
  }
}
