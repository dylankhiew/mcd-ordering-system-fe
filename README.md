## McD Killer - FeedMe Software Engineer Take Home Assignment
Welcome to the ordering system of what McD should have been, fast, efficient and coded in 30 mins (minus the planning time). Also its pay to win!

---

Visit the website here: https://mcd-ordering-system-fe.vercel.app/

---
### Features
Well, since this is a prototype, not much. What we can do is bare minimum, we can:

- Add bots
- Remove bots
- Add new order
- Add new VIP order
- Dark/Light Mode (wow)
---
### Tech Stack
I decided to go with Vite + TypeScript as Create React App is no longer the viable option. TypeScript for its strict typings and React because I am familiar with based on my React Native experience. React Context for state management, something simple

### Technical Features and Consideration
Here's what I used for the prompting

- GitHub Copilot (Claude Sonnet 4.5)
- Here's the plan mode prompt I used initially


<details>
  <summary>Long prompt incoming</summary>
  
  ```
User Story
As below is part of the user story:

As McDonald's normal customer, after I submitted my order, I wish to see my order flow into "PENDING" area. After the cooking bot process my order, I want to see it flow into to "COMPLETE" area.
As McDonald's VIP member, after I submitted my order, I want my order being process first before all order by normal customer. However if there's existing order from VIP member, my order should queue behind his/her order.
As McDonald's manager, I want to increase or decrease number of cooking bot available in my restaurant. When I increase a bot, it should immediately process any pending order. When I decrease a bot, the processing order should remain un-process.
As McDonald bot, it can only pickup and process 1 order at a time, each order required 10 seconds to complete process.

Requirements
When "New Normal Order" clicked, a new order should show up "PENDING" Area.
When "New VIP Order" clicked, a new order should show up in "PENDING" Area. It should place in-front of all existing "Normal" order but behind of all existing "VIP" order.
The order number should be unique and increasing.
When "+ Bot" clicked, a bot should be created and start processing the order inside "PENDING" area. after 10 seconds picking up the order, the order should move to "COMPLETE" area. Then the bot should start processing another order if there is any left in "PENDING" area.
If there is no more order in the "PENDING" area, the bot should become IDLE until a new order come in.
When "- Bot" clicked, the newest bot should be destroyed. If the bot is processing an order, it should also stop the process. The order now back to "PENDING" and ready to process by other bot.
No data persistance is needed for this prototype, you may perform all the process inside memory.

This will be a fully front end app, do ask me if there are more requirements needed from me, but here are some requirments:

1.⁠ ⁠Ensure folder strcuture is well organised, components/screens/constants/utils
2.⁠ ⁠Ensure there are test cases for utils and snapshot if needed
3.⁠ ⁠If variables are fixed, do include it into a constant with this format CONSTANT_NAME
4.⁠ ⁠The system should be able to handle when there's a new VVIP or something and should be dynamic in that sense
5.⁠ ⁠Ensure there is a Do Not Repeat practice
6.⁠ ⁠Ensure the design is glass-like theme with light mode and dark mode support, preferably in black and salmon color. 
7.⁠ ⁠You may use react context for state management
8.⁠ ⁠Ensure test cases is also applied to the context as well to test all scenarios

```
  
</details>


Then I asked it to refine on mobile responsiveness, solved some typing issues as well as changed the name to McD Killer. 

---

### Thoughts and Improvement
- This is honestly my first test which allows me to user vibe coding, I actually had fun trying this GitHub Copilot (thanks company), and am impressed by its skill and power damn.
- Although its vibe coded, I ensure that test cases are convered where it's necessary like context, components and whatnot as these are good for when humans like us change things here and there and might cause issues in the existing components or context, so that helps in that sense.
- I also specifically asked it to ensure its all neatly arranged in folders as it will be more organised and easier for the eyes.  
---

### Screenshots and Preview (in case yall lazy to run) 
---

<img width="700" alt="Screenshot 2026-02-11 at 9 26 04 PM" src="https://github.com/user-attachments/assets/937575f1-f786-4bdc-a542-216f3c72084b" />

---
<img width="700" alt="Screenshot 2026-02-11 at 9 27 35 PM" src="https://github.com/user-attachments/assets/6a450cb4-6b11-4d30-85c2-a61ba9367c10" />

---

Demo of bots working hard

https://github.com/user-attachments/assets/7315a523-5858-48fa-abd3-0ce2c5abe9d5


---
### Acknowledgements
- Thank you Jeromy Kho for referring me to this awesome company (and asked me to try out the Plan Mode, truly a gamechanger).
