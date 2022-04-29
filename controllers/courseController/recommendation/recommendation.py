"""
Recommendation System

Links
	- https://towardsdatascience.com/how-to-build-a-recommendation-engine-quick-and-simple-aec8c71a823e
	- https://www.analyticsvidhya.com/blog/2018/06/comprehensive-guide-recommendation-engine-python/


source_path = os.path.join("data/coursera-courses.csv")
"""

# import streamlit as st
import sys
import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import altair as alt

from rake_nltk import Rake
from nltk.corpus import stopwords
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

FILTERED_COURSES = None
SELECTED_COURSE = None


def clean_col_names(df, columns):
    """
    Cleans column names
    -----
    columns:
            List of column names
    """

    new = []
    for c in columns:
        new.append(c.lower().replace(' ', '_'))
    return new


def prepare_data(df):
    """
    Prepares the final dataset
    -----
    df:
            dataframe
    """
    # clean column names
    df.columns = clean_col_names(df, df.columns)

    # impute missing values that creeped in
    df['skills'] = df['skills'].fillna('Missing')
    df['instructors'] = df['instructors'].fillna('Missing')

    # making certain features numeric
    def make_numeric(x):
        if(x == 'Missing'):
            return np.nan
        return float(x)

    df['course_rating'] = df['course_rating'].apply(make_numeric)
    df['course_rated_by'] = df['course_rated_by'].apply(make_numeric)
    df['percentage_of_new_career_starts'] = df['percentage_of_new_career_starts'].apply(
        make_numeric)
    df['percentage_of_pay_increase_or_promotion'] = df['percentage_of_pay_increase_or_promotion'].apply(
        make_numeric)

    def make_count_numeric(x):
        if('k' in x):
            return (float(x.replace('k', '')) * 1000)
        elif('m' in x):
            return (float(x.replace('m', '')) * 1000000)
        elif('Missing' in x):
            return (np.nan)
        print("HELLOOOOOOOOOOO")

    df['enrolled_student_count'] = df['enrolled_student_count'].apply(
        make_count_numeric)

# extract time to complete
    def find_time(x):
        l = x.split(' ')
        idx = 0
        for i in range(len(l)):
            if(l[i].isdigit()):
                idx = i
        try:
            return (l[idx] + ' ' + l[idx+1])
        except:
            return l[idx]

    df['estimated_time_to_complete'] = df['estimated_time_to_complete'].apply(
        find_time)

    # split by skills
    def split_it(x):
        return (x.split(','))
    df['skills'] = df['skills'].apply(split_it)

    return df


def load_data():
    # print(os.path())
    source_path1 = os.path.join(
        "recommendation/data/coursera-courses-overview.csv")
    source_path2 = os.path.join(
        "recommendation/data/coursera-individual-courses.csv")
    df_overview = pd.read_csv(
        source_path1, encoding="ISO-8859-1", engine='python')
    df_individual = pd.read_csv(source_path2)
    df = pd.concat([df_overview, df_individual], axis=1)

    # preprocess it now
    df = prepare_data(df)

    return df


def filter(dataframe, chosen_options, feature, id):
    selected_records = []

    print(*chosen_options, feature, id)
    for i in range(7):
        for op in chosen_options:
            if op in dataframe[feature][i]:
                selected_records.append(dataframe[id][i])
    return selected_records


def extract_keywords(df, feature):
    r = Rake()
    keyword_lists = []
    for i in range(7):
        descr = df[feature][i]
        r.extract_keywords_from_text(descr)
        key_words_dict_scores = r.get_word_degrees()
        keywords_string = " ".join(list(key_words_dict_scores.keys()))
        keyword_lists.append(keywords_string)

    return keyword_lists


def extract_keywords(df, feature):

    r = Rake()
    keyword_lists = []
    for i in range(df[feature].shape[0]):
        descr = df[feature][i]
        r.extract_keywords_from_text(descr)
        key_words_dict_scores = r.get_word_degrees()
        keywords_string = " ".join(list(key_words_dict_scores.keys()))
        keyword_lists.append(keywords_string)

    return keyword_lists


def recommendations(df, input_course, cosine_sim, find_similar=True, how_many=5):

    # initialise recommended courses list
    recommended = []
    selected_course = df[df['course_name'] == input_course]

    # print(selected_course)

    # index of the course fed as input
    idx = selected_course.index[0]

    # creating a Series with the similarity scores in descending order
    if(find_similar):
        score_series = pd.Series(cosine_sim[idx]).sort_values(ascending=False)
    else:
        score_series = pd.Series(cosine_sim[idx]).sort_values(ascending=True)

    # getting the indexes of the top 'how_many' courses
    if(len(score_series) < how_many):
        how_many = len(score_series)
    top_sugg = list(score_series.iloc[1:how_many+1].index)

    # populating the list with the titles of the best 10 matching movies
    for i in top_sugg:
        qualified = df['course_name'].iloc[i]
        recommended.append(qualified)

    return recommended


def content_based_recommendations(df, input_course, courses):

    # filter out the courses
    df = df[df['course_name'].isin(courses)].reset_index()
    # create description keywords
    df['descr_keywords'] = extract_keywords(df, 'description')
    # instantiating and generating the count matrix
    count = CountVectorizer()
    count_matrix = count.fit_transform(df['descr_keywords'])
    # generating the cosine similarity matrix
    cosine_sim = cosine_similarity(count_matrix, count_matrix)

    # make the recommendation
    rec_courses_similar = recommendations(df, input_course, cosine_sim, True)
    temp_sim = df[df['course_name'].isin(rec_courses_similar)]
    rec_courses_dissimilar = recommendations(
        df, input_course, cosine_sim, False)
    temp_dissim = df[df['course_name'].isin(rec_courses_dissimilar)]

    # print(type(rec_courses_similar))
    # print(*rec_courses_similar)

    print(type(temp_sim))
    print("HEHEHE")
    print(*temp_sim)

    # top 3
    file1 = open('myfile.txt', "w+")

    # file1.writelines(temp_sim)
    with open('myfile.txt', 'w') as f:
        for item in rec_courses_similar:
            f.write("%s\n" % item)

    file1.close()

    print("Top 5 most similar courses")
    print(temp_sim)
    print("Top 5 most dissimilar courses")
    print(temp_dissim)


def prep_for_cbr(df, skills_select):

    # content-based filtering

    print("This section is entrusted with the responsibility of"
          " analysing a filtered subset of courses based on the **skills**"
          " a learner is looking to develop. This filter can be adjusted on"
          " the sidebar.")
    print("This section also finds courses similar to a selected course"
          " based on Content-based recommendation. The learner can choose"
          " any course that has been filtered on the basis of their skills"
          " in the previous section.")
    print("Choose course from 'Select Course' dropdown on the sidebar")

    # filter by skills
    skills_avail = []
    for i in range(7):
        skills_avail = skills_avail + df['skills'][i]

    skills_avail = list(set(skills_avail))
    # skills_select = st.sidebar.multiselect("Select Skills", skills_avail)
    # use button to make the update of filtering
    skill_filtered = None
    courses = None
    input_course = "Nothing"
    # if st.sidebar.button("Filter Courses"):

    temp = filter(df, skills_select, 'skills', 'course_url')

    skill_filtered = df[df['course_url'].isin(temp)].reset_index()

    # update filtered courses
    courses = skill_filtered['course_name']
    print("### Filtered courses based on skill preferences")
    # print(skill_filtered)
    # print(courses)
    # some more info
    print("**Number of programmes filtered:**", skill_filtered.shape[0])
    print("**Number of courses:**",
          skill_filtered[skill_filtered['learning_product_type'] == 'COURSE'].shape[0])
    print("**Number of professional degrees:**",
          skill_filtered[skill_filtered['learning_product_type'] == 'PROFESSIONAL CERTIFICATE'].shape[0])
    print("**Number of specializations:**",
          skill_filtered[skill_filtered['learning_product_type'] == 'SPECIALIZATION'].shape[0])
    # basic plots
    chart = alt.Chart(skill_filtered).mark_bar().encode(
        y='course_provided_by:N',
        x='count(course_provided_by):Q'
    ).properties(
        title='Organizations providing these courses'
    )
    # st.altair_chart(chart)
    # print(skills_select)
    # there should be more than atleast 2 courses
    if(len(courses) <= 2):
        print("*There should be atleast 3 courses. Do add more.*")

    # input_course = st.sidebar.selectbox(
    #     "Select Course", courses, key='courses')
    print(sys.argv[1])
    input_course = sys.argv[2]
    # use button to initiate content-based recommendations
    # else:
    #print("```Adjust the 'Select Skills' filter on the sidebar```")

    rec_radio = 'yes'
    if (rec_radio == 'yes'):
        content_based_recommendations(df, input_course, courses)

    # recommend based on selected course


def main():
    # load and disp data
    try:
        print("HELLO")
        df = load_data()
        # toggle button to display raw data
        # if st.sidebar.checkbox("Display raw data", key='disp_data'):
        # print(df)
        # else:
        # pass
        # initiate CBR
        print('First param:' + type(sys.argv[1])+'#')

        print(type(sys.argv[1]))
        print('Second param:'+sys.argv[2]+'#')
        prep_for_cbr(df, sys.argv[1])
    except:
        print("An exception error occurred")


# if __name__ == "__main__":
main()


print("HERERER")
