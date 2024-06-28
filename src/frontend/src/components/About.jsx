import React from "react";


const About = () => (

    // <div className="about-content w-full h-full">
    <div className="min-h-screen flex flex-col min-w-screen p-8 overflow-y-scroll mb-10 pb-16" style={{ marginTop: '110px', marginLeft: '0px', marginRight: '0px'}}>

        <h1>About this application</h1>
        <div>
            <h3>A tool to assess the "Rosiness" of economic reports and stock data</h3>
            <p>
                To develop an integrated system that retrieves, stores, and analyzes economic and financial data from multiple sources, with the aim of identifying and correlating cause-and-effect relationships between various economic indicators and financial market trends. The system will also overlay significant government interventions, such as changes in interest rates, tax breaks, and currency policies, to provide a comprehensive view of market dynamics. The project will focus on analyzing the impact of federal policies on stock data, along with three main aspects: credit card volume and delinquency analysis, cumulative fact tables, and creating engaging metrics for everyday users/investors.
            </p>
        </div>
        <div className="mt-8 min-w-screen mr-8 ml-8">
            <div>
            <h2>Project Description</h2>
            <p>
            This Capstone development effort is to identify trends and cross-correlative insights between cause and effect relationships around government stimulus, bailouts and other significant events.  The long term goal is to facilitate easy analysis by providing charts and graph components that can be aligned and layered, and highlighting significant events and correlations.
                For the purposes of capstone; it was decided to build a solution that would meet the basic needs as a kick off to this effort, and build out the infrastructure, the framework and the initial ideas as a proof of concept.
            </p>
            <p>
                With the AI boom underway, additional considerations are being reviewed, including the ability to use Generative AI to facilitate incorporation of quarterly reports and developing language models that would help assess whether events reported by companies align with industry and news reports.
                Additionally, comparative analysis to provide objective comparisons could also be a useful investment reporting tool and could also leverage Generative AI to enhance stock and economic reviews.
            </p>
            <p>

            </p>
                <p>
                    <h3>Technical Stack</h3>
                    <ul>
                        <li><b>Frontend</b>: ReactJS+TailwindCSS using ViteJS</li>
                        <li><b>Backend</b>: Python + FastAPI (including Matplotlib &amp; Plotly</li>
                        <li><b>Exploration</b>: Jupyter Notebooks</li>
                        <li><b>Database</b>: PostgreSQL</li>
                        <li><b>Pipeline Orchestration</b>: Astronomer Airflow &amp; dbt (dbt-labs) for workflow definition</li>
                    </ul>
                </p>
            </div>
            <div className="pt-10">
            <h3>Notes from the road</h3>
            <p>
                <ul>

                    <li></li>
                </ul>
            </p>
                </div>
            <div className="pt-10">
            <h3>Additional Notes</h3>

            <p>
                <ul>
                    {/*<li></li>*/}
                </ul>
            </p>
                </div>
        </div>
    </div>
);

export default About;
