import styles from '../styles/Leaderboard.module.css';
import { Sidebar } from '../components';
import Papa from 'papaparse';
import React, { Component } from 'react'

export async function getStaticProps() {
    const result = await fetch('https://docs.google.com/spreadsheets/d/1IFTQhI534HoRBho6ZarZnU1p_8pPib9tywlDoagInh0/gviz/tq?tqx=out:csv', {
        method: 'GET',
    });
    const text = await result.text();
    let data = Papa.parse(text).data.slice(2);
    data.forEach((d,i)=>{
        data[i] = data[i].filter(el=>{
            return el!='';
        });
        if(data[i].length<3) {
            while(data[i].length!=3) {
                data[i].push('');
            }
        }
    });
    /* 0=>name; 1=>discord; 2=>score */
    data.sort((a, b) => {
        if(b[2] == '' && a[2] == '') {
            return 0;
        }
        if(b[2] == '' && a[2] != '') {
            return -1;
        }
        if(b[2] != '' && a[2] == '') {
            return 1;
        }
        if(parseInt(b[2]) >parseInt(a[2])) {
            return 1;
        }
        if(b[2] == a[2]) {
            if(a[0]<=b[0]) {
                return -1;
            }
            return 1;
        }
        return -1
    });
    data.forEach((d,i)=>{
        data[i].push(i+1);
        d.forEach((t, j) => {
            if(d[j]=='') {
                d[j] = '<none>'
            }
        })
    })
    return {
        props: {
            data
        },
        revalidate:5
    }
}

export default class leaderboard extends Component {
    constructor({data}) {
        super();
        this.state = {
            view: null,
            full: data,
            top: data.slice(0,5),
            toggle: true  //top5
        }
        this.timeout = 0;
        this.top5 = this.top5.bind(this)
        this.all = this.all.bind(this)
        this.handleText = this.handleText.bind(this)
        this.updateView = this.updateView.bind(this)
    }

    textInput = React.createRef();
    animate = React.createRef();

    top5 = function(evt) {
        this.updateView(this.state.top)
    }

    all = function(evt) {
        this.updateView(this.state.full)
    }

    handleText = function() {
        if(this.timeout)
            clearTimeout(this.timeout)
        this.timeout = setTimeout(()=>{
            let x = this.textInput.current.value
            this.state.toggle = !this.state.toggle;
            if( x == undefined || x == '') {
                if(this.state.toggle) {
                    this.top5();
                }
                else {
                    this.all();
                }
            }
            else {
                let v = this.state.full.filter(el=>{
                    if(el && el[1])
                        return el[1].startsWith(x);
                    return false;
                })
                this.updateView(v, false);
            }
        },300)
    }

    updateView = function(data, anim = true) {
        if(data == undefined) {
            this.setState({
                view: <h4>Server down</h4>
            })
        }
        else if(data.length == 0) {
            this.setState({
                view: <h4>No field to display!</h4>,
                toggle : !this.state.toggle
            })
        }
        else {
            let animation; 
            if(anim)
                animation = this.state.toggle ? styles.rotate : styles.slideLeft;
            else
                animation = ""
            this.setState({
                view : data.map((d, id)=>{
                    return (
                        <div key={id} className={styles.resultRow + ' ' + animation}>
                            <h1 className={styles.rank}>{d[3]}.</h1>
                            <div className={styles.name}>
                                <h3>{d[0]}</h3>
                                <p>{d[1]}</p>
                            </div>
                            <span className={styles.divider}><span></span></span>
                            <h1 className={styles.score}>{d[2]}</h1>
                        </div>
                    );
                }), toggle : !this.state.toggle }, 
            )
        }
    }

    componentDidMount() {
        this.state.full ? this.top5() : this.setState((this.state.view=<p>Could not load any data!</p>));
    }
    render() {
        return (
            <>
            <main className={styles.row}>
                <Sidebar></Sidebar>
                <section className={styles.leaderboard}>
                    <div className={styles.main}>
                        <div className={styles.topBar}>
                            <h1 className={styles.title}>LEADERBOARD</h1>
                            <ul className={styles.nav}>
                            <li><button disabled={!this.state.toggle} onClick={this.top5}>TOP 5</button></li>
                            <li><button disabled={this.state.toggle} onClick={this.all}>ALL</button></li>
                            </ul>
                        </div>
                        <div className={styles.styledBar}></div>
                        <h2 className={styles.searchTitle}>SEARCH FOR YOUR RANK</h2>
                        <div className={styles.searchBar}>
                            <input ref={this.textInput} onChange={this.handleText} type="text" formNoValidate spellCheck="false" placeholder="ENTER DISCORD USERNAME ..."></input>
                            <button onClick={this.findScore}>SEARCH</button>
                        </div>
                        <ul className={styles.sNav}>
                            <li><button disabled={!this.state.toggle} onClick={this.top5}>TOP 5</button></li>
                            <li><button disabled={this.state.toggle} onClick={this.all}>ALL</button></li>
                        </ul>
                        <main className={styles.grid}>
                            {this.state.view}
                        </main>
                    </div>
                </section>
            </main>
            </>
        );
    }
}
