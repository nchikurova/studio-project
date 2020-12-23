# Coronavirus rent crisis

 ![](confidence.png)
 ![](conf.png)
 
  Coronavirus is the most important event of 2020 and one of the most important events in the history. Millions of people around the world have been sickened and hundreds of thousands of others have died. The entire lifestyle has been changed. As for December 2020, we all still required to wear masks and preferably stay home. 
  
  The most important part for me is what we can learn and how we can get prepared for such a global event like Coronavirus. I decided to look for the available data of the impact of Coronavirus on Americans. I came across U.S. Census House Hold Survey, which was designed specifically for measuring the impact of Coronavirus on household. The House Hold survey includes many different tables; each of them describes one of these categories: education, employment, housing, food sufficiency, health, social security, spending and transportation. All of those indicators are important however the first thing we need is the shelter over our heads. The loss of employment caused decrease of household income and, therefore, brought lack of confidence to pay rent. To explore percentage and number of people and their lack of confidence during 2020, for my analysis I chose Housing Tables. 
  
  My main goal of this project is to show people that big percentage of us were not prepared for such event, which categories were affected the most and what we can do to prepare ourselves for the future events like that. 
 
 ### Data Documentation
 
 * [Data Source](https://www.census.gov/programs-surveys/household-pulse-survey/data.html#phase1)
 * [Census.gov](https://www.census.gov/)

 * [Data Structure](https://github.com/nchikurova/studio-project/blob/main/data/week_1.csv)
 
 * Data Manipulation in Jupyter Notebooks
 * * [`dataframe`](https://github.com/nchikurova/advanced-studio/blob/master/Data_manipulation_dataframe.ipynb)
 * * [`openpuxl`](https://github.com/nchikurova/advanced-studio/blob/master/Data_openpyxl_new.ipynb)
 * * [`xlrd`](https://github.com/nchikurova/advanced-studio/blob/master/Data_xlrd_new.ipynb)
 
 * [Data Structure](https://github.com/nchikurova/studio-project/blob/main/data/week_1.csv)
 * Data Description

        "total": total
        "wrent": occupied without rent
        "noconf": no confidence
        "slightconf": slight confidence
        "modconf": moderate confidence
        "highconf": high confidence
        "deferred": payment is/will be deferred
        "didnotrep": did not report
        "didnottenure": did not report to tenture
        
  The idea of color palette was taken from New York State Department of Labor. I liked the variety of dark turquoise color and how its shades merge with white, grey and black. Later on, I decided to add some more colors since I needed them for the variety of categories. 
  
My initial plan was to explore US total number for all weeks at first to see overall picture how the confidence of paying rent has been changing throughout these weeks, then to narrow the analysis down to the state total numbers.

  The first chart in my mind was a heatmap, because this type of the chart can clearly show the relationship between two variables and any patterns in value for these variables by the change of the cells color. It is one of two charts that I haven’t changed during the process. The second chart is the US map. I think it is the easiest way to show the difference of numbers in all states by color. Other charts were varying during the process. The structure of the data turned up more difficult than I expected. After hours of cleaning, filtering and rearranging the data in Excel and Python, I realized that every week consists of US total numbers and every states’ total numbers, and even .json file wouldn’t solve the problem of US being leveled up with every state. So, for my barchart and Scatter plot I ended up taking US numbers and comparing them in between weeks. Most of Americans were given stimulus check and those who lost their job started to get unemployment. So, I assumed that to see the first reaction to the pandemic of American people I should analyze and compare first two weeks of the Household Survey. For the last chart I chose scatter plot where the number of people is represented by the x-axis and the size of the circle is represented, and the category such as age, education, income and etc. by color. Each category includes few characteristics. All characteristics are the same color and different sizes. For now, the user can see which characteristics are which only by hovering over the circles. The size and position of the circles are very different so it was difficult for me to add text over the characteristics. I hope I will find another way.
  
Although the structure of the data did not let me realize some of my ideas I definitely learned a lot through dealing with it. For the second part I ended up combining two charts: US map and barchart. US map shows the percentage of people who had no confidence by state, while barchart shows the percentage of people having all levels of confidence by country. For mapping the data with `.json` file I used abbreviations for states

  ### Prototypes
 
 * [US Map](https://observablehq.com/@nchikurova/us-map-by-household-median-income-2017)
 * [Heatmap](https://observablehq.com/@nchikurova/heatmap)
 * [Data exploration](https://observablehq.com/@nchikurova/untitled)
 * [Data wrangling](https://observablehq.com/d/65408b7a9bd98edd)
 * [Code prototype](https://github.com/nchikurova/studio-project/tree/main/project_state_prototypes)
 
 * [Project Brief - Visual Desk Drfat](https://drive.google.com/file/d/1cAxLVb19tX-V9ysfmJltnS2aD_roqO1O/view?usp=sharing)
 
 To continue my analysis I want to separate US total numbers data and state total numbers, and visualize all four levels of confidnce in paying rent next month by state. It also will help me to get to the categories by state. For
 
 ### Stable Links
 
 * [Prerecorded walkthrough](https://drive.google.com/file/d/1Vo47aRRwCOqAlID00kRKO2NfCTfiMmRT/view?usp=sharing)
 * [Project link](https://nchikurova.github.io/studio-project/project_global/)
