from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import matplotlib.pyplot as plt
import io

app = FastAPI()
def create_chart(data, title, ylabel):
    fig, ax = plt.subplots(figsize=(10, 6))

    y_offset = 0.85  # Higher up in the chart
    y_spacing = 0.05  # Spacing between each annotation

    print("title:{}".format(title))



    for key, value in data.items():
        years = value['years']
        amounts = value['amounts']
        labels = value['labels']
        color = value['color']

        ax.plot(years, amounts, label=key, marker='o', color=color)

        for i, txt in enumerate(labels):
            if 'stimulus' in key.lower():
                x_position = 0.55  # Move stimulus annotations to the right
            else:
                x_position = 0.05  # Move other annotations to the left
            print(key)
            ax.annotate(
                txt, xy=(x_position, y_offset - i * y_spacing), xycoords='axes fraction',
                textcoords='offset points', xytext=(5, 0), ha='left',
                color=color, fontsize=10, fontweight='bold',
                arrowprops=dict(arrowstyle="->", connectionstyle="arc3", color=color, lw=1.5)
            )

    ax.set_ylabel(ylabel, fontsize=14, fontweight='bold')
    ax.set_title(title, fontsize=16, fontweight='bold')
    ax.grid(True, linestyle='--', alpha=1)
    ax.set_facecolor('#f0f0f0')
    ax.legend(fontsize=14)

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)

    return buf


@app.get("/combined-chart")
async def get_combined_chart():
    data = {
        'Stimulus': {
            'years': [1997, 2001, 2008, 2009, 2020, 2020, 2021],
            'amounts': [95, 120, 152, 831, 2200, 900, 1900],  # in billion $
            'labels': [
                "Taxpayer Relief Act", "Economic Growth and Tax Relief Reconciliation Act",
                "Economic Stimulus Act", "American Recovery and Reinvestment Act",
                "CARES Act", "Consolidated Appropriations", "American Rescue Plan"
            ],
            'color': 'blue'
        },
        'Bailouts': {
            'years': [2001, 2008, 2008, 2008, 2008, 2008, 2009, 2020, 2020],
            'amounts': [18.6, 30, 200, 180, 25, 700, 45, 669, 50],  # in billion $
            'labels': [
                "Airline Industry", "Bear Stearns", "Fannie Mae/Freddie Mac", "AIG",
                "Auto Industry", "TARP", "Citigroup", "Paycheck Protection Program", "Airline Industry"
            ],
            'color': 'green'
        }
    }

    buf = create_chart(data, 'US Economic Stimulus and Bailouts (1995-2023)', 'Amount (in billion $)')
    return StreamingResponse(buf, media_type='image/png')

@app.get("/stimulus-chart")
async def get_stimulus_chart():
    data = {
        'Stimulus': {
            'years': [1997, 2001, 2008, 2009, 2020, 2020, 2021],
            'amounts': [95, 120, 152, 831, 2200, 900, 1900],  # in billion $
            'labels': [
                "Taxpayer Relief Act", "Economic Growth and Tax Relief Reconciliation Act",
                "Economic Stimulus Act", "American Recovery and Reinvestment Act",
                "CARES Act", "Consolidated Appropriations", "American Rescue Plan"
            ],
            'color': 'blue'
        }
    }

    buf = create_chart(data, 'US Economic Stimulus (1997-2023)', 'Amount (in billion $)')
    return StreamingResponse(buf, media_type='image/png')

@app.get("/bailouts-chart")
async def get_bailouts_chart():
    data = {
        'Bailouts': {
            'years': [2001, 2008, 2008, 2008, 2008, 2008, 2009, 2020, 2020],
            'amounts': [18.6, 30, 200, 180, 25, 700, 45, 669, 50],  # in billion $
            'labels': [
                "Airline Industry", "Bear Stearns", "Fannie Mae/Freddie Mac", "AIG",
                "Auto Industry", "TARP", "Citigroup", "Paycheck Protection Program", "Airline Industry"
            ],
            'color': 'green'
        }
    }

    buf = create_chart(data, 'US Economic Bailouts (2001-2023)', 'Amount (in billion $)')
    return StreamingResponse(buf, media_type='image/png')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
