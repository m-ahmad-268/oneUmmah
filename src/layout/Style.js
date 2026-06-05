import { Layout, Steps } from 'antd';
import Styled from 'styled-components';

const { Footer } = Layout;

const NavTitle = Styled.p`
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    color: rgb(146, 153, 184);
    padding: 0px 15px;
    display: flex;
`;

const LayoutContainer = Styled.div`
    .ant-layout {
        background-color: transparent;
        .ant-layout-header{
            padding: ${({ theme }) => (!theme.rtl ? '0 5px 0 0' : '0 0 0 5px')};
            height: 72px;
            @media only screen and (max-width: 991px){
                padding: 0 10px;
            }
        }
    }
    .ant-layout.layout {
        background-color: ${({ theme }) => theme[theme.mainContent]['main-background']};
    }

    .ninjadash-nav-actions__searchbar{
        display: flex;
        align-items: center;
        svg,
        img{
            width: 16px;
            height: 16px;
            color: ${({ theme }) => theme[theme.mainContent]['gray-light-text']};
        }
        .ninjadash-searchbar{
            opacity: 0;
            visibility: hidden;
            transition: .35s;
            @media only screen and (max-width: 767px){
                position: fixed;
                top: 45px;
                right: 0;
                min-width: 280px;
                z-index: 98;
                box-shadow: 0 5px 30px ${({ theme }) => theme[theme.mainContent]['gray-text']}15;
            }
            input{
                user-select: none;
                pointer-events: none;
                &:focus{
                    outline: none;
                    box-shadow: 0 0;
                }
            }
            .ant-form-item{
                margin-bottom: 0;
            }
        }
        &.show{
            .ninjadash-searchbar{
                opacity: 1;
                visibility: visible;
                input{
                    user-select: all;
                    pointer-events: all;
                }
            }
            .ninjadash-search-icon{
                display: none;
            }
            .ninjadash-close-icon{
                display: block !important;
                top: 2px;
                svg{
                    color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
                }
            }
        }
        .ninjadash-close-icon{
            display: none !important;
        }
        a{
            line-height: .8;
            position: relative;
            top: 2px;
            @media only screen and (max-width: 767px){
                top: 0;
            }
        }
    }

    /* ninjadash Header Style */
    .ninjadash-header-content{
        height: 100%;
        .ninjadash-header-content__left{
            min-width: 280px;
            padding: 0 20px 0 30px;
            background-color: ${({ theme }) => theme[theme.mainContent]['brand-background']};
            @media only screen and (max-width: 1499px){
                min-width: 220px;
            }
            @media only screen and (max-width: 767px){
                padding: 0 20px 0 8px;
                min-width: auto;
                margin-right: 0;
            }
            .navbar-brand{
                display: flex;
                justify-content: space-between;
                align-items: center;
                button{
                    padding: 0;
                    line-height: 0;
                    margin-top: 4px;
                    color: ${({ theme }) => theme[theme.mainContent]['extra-light']};
                    @media only screen and (max-width: 875px){
                        padding: ${({ theme }) => (theme.rtl ? '0 10px 0 20px' : '0 20px 0 10px')};
                    }
                    @media only screen and (max-width: 767px){
                        order: -1;
                        padding: ${({ theme }) => (theme.rtl ? '0 0 0 15px' : '0 15px 0 0')};
                    }
                }
            }
            .ninjadash-logo{
                @media only screen and (max-width: 875px){
                    ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 4px;
                }
                @media only screen and (max-width: 767px){
                    ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 0;
                }
                img{
                    max-width: ${({ theme }) => (theme.topMenu ? '140px' : '120px')};
                    width: 100%;
                    @media only screen and (max-width: 475px){
                        max-width: ${({ theme }) => (theme.topMenu ? '100px' : '100px')};
                    }
                }
            }
        }
        .ninjadash-header-content__right{
            flex: auto;
            .ninjadash-nav-actions{
                display: flex;
                justify-content: flex-end;
                align-items: center;
                flex: auto;
                padding-right: 12px;
                @media only screen and (max-width: 767px){
                    display: none;
                }
                .ninjadash-nav-actions__language,
                .ninjadash-nav-actions__author{
                    line-height: 1;
                }
                .ninjadash-nav-actions__searchbar{
                    margin-right: 10px;
                    margin-top: -1px;
                }
                .ninjadash-nav-actions__author{
                    margin: 0 3px;
                    .ninjadash-nav-action-link{
                        display: flex;
                        align-items: center;
                        i,
                        svg,
                        img {
                            width: 16px;
                            height: 16px;
                            color: ${({ theme }) => theme[theme.mainContent]['light-text']}};
                        }
                        i,
                        svg{
                            position: relative;
                            top: 2px;
                        }
                        .ant-avatar-image{
                            img{
                                min-width: 32px;
                                max-width: 32px;
                                min-height: 32px;
                            }
                        }
                    }
                }
                .ninjadash-nav-actions__author--name{
                    font-size: 14px;
                    display: inline-block;
                    font-weight: 500;
                    margin: ${({ theme }) => (theme.rtl ? '0 10px 0 6px' : '0 6px 0 10px')};
                    color: ${({ theme }) => theme[theme.mainContent]['white-text']};
                    @media only screen and (max-width: 991px){
                        display: none;
                    }
                }
            }      
        }
        .ninjadash-header-content__mobile{
            display: none;
            @media only screen and (max-width: 767px){
                display: block;
            }
            .ninjadash-mobile-action{
                position: absolute;
                ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 20px;
                top: 50%;
                transform: translateY(-50%);
                display: inline-flex;
                align-items: center;
                @media only screen and (max-width: 767px){
                    ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 15px;
                }
                a,
                .btn-search{
                    display: inline-flex;
                    color: ${({ theme }) => theme['light-color']};
                    &.btn-search{
                        ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 18px;
                        @media only screen and (max-width: 475px){
                            ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 10px;
                        }
                    }
                    svg{
                        width: 18px;
                        height: 18px;
                    }
                }
                .ninjadash-searchbar{
                    .ant-input{
                        border: 0 none;
                    }
                    .ant-row{
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
    .ninjadash-header-more{
        .ninjadash-nav-actions__author{
            .ninjadash-nav-actions__author--name{
                display: none;
            }
            .ninjadash-nav-action-link{
                display: flex;
                align-items: center;
                .ant-avatar-image{
                    ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 5px;
                }
                svg{
                    width: 20px;
                    height: 20px;
                    color: ${({ theme }) => theme[theme.mainContent]['light-text']}};
                }
            }
        }
        .ninjadash-nav-actions__message,
        .ninjadash-nav-actions__notification,
        .ninjadash-nav-actions__settings{
            position: relative;
            top: 4px;
        }
        .ninjadash-nav-actions__message{
            .ant-badge-dot{
                background-color: ${({ theme }) => theme['success-color']}};
            }
        }
    }
    header{
        box-shadow: 0 5px 20px ${({ theme }) => theme['extra-light-color']}05;
        z-index: 998;
        background-color: ${({ theme }) => theme[theme.mainContent]['white-background']};
        @media print {
            display: none;
        }
        .ant-menu-sub.ant-menu-vertical{
            .ant-menu-item{
                a{
                    color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
                }
            }
        }
        .ant-menu.ant-menu-horizontal{
            display: flex;
            align-items: center;
            margin: 0 -16px;
            li.ant-menu-submenu{
                margin: 0 16px;
            }
            .ant-menu-submenu{
                &.ant-menu-submenu-active,
                &.ant-menu-submenu-selected,
                &.ant-menu-submenu-open{
                    .ant-menu-submenu-title{
                        color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                        svg,
                        i{
                            color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                        }
                    }
                }
                .ant-menu-submenu-title{
                    font-size: 14px;
                    font-weight: 500;
                    color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                    svg,
                    i{
                        color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                    }
                    .ant-menu-submenu-arrow{
                        font-family: "FontAwesome";
                        font-style: normal;
                        ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: 6px;
                        &:after{
                            color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                            content: '\f107';
                            background-color: transparent;
                        }
                    }
                }
            }
        }
    }

    /* Sidebar styles */
    .ant-layout-sider {
        box-shadow: 0 0 20px ${({ theme }) => theme['extra-light-color']}05;
        @media (max-width: 991px){
            box-shadow: 0 0 10px #00000020;
        }
        @media print {
            display: none;
        }

        .custom-scrollbar{
            .ninjadash-track-vertical{
                position: absolute;
                width: 6px;
                transition: opacity 200ms ease 0s;
                opacity: 0;
                ${({ theme }) => (!theme.rtl ? 'right' : 'left')}: 0;
                bottom: 2px;
                top: 2px;
                border-radius: 3px;
                >div{
                    background-color: ${({ theme }) => theme[theme.mainContent]['scroll-bg']}!important;
                }
            }
        }

        .ant-menu{
            background-color: ${({ theme }) => theme[theme.mainContent]['white-background']};
        }

        &.ant-layout-sider-collapsed{
            padding: 15px 0px 55px !important;
            .ant-layout-sider-children{
                .ninjadash-sidebar-nav-title{
                    display: none;
                }
            }
            & + .atbd-main-layout{
                ${({ theme }) => (!theme.rtl ? 'margin-left' : 'margin-right')}: 80px;

            }
            .ant-menu-item-group{
                display: none;
            }
            .ant-menu-item{
                color: #333;
                .badge{
                    display: none;
                }
            }
            .ant-layout-sider-children{
                .ant-menu .ant-menu-submenu, 
                .ant-layout-sider-children .ant-menu .ant-menu-item{
                    ${({ theme }) => (!theme.rtl ? 'padding-right' : 'padding-left')}: 0;
                }
            }
        }

        &.ant-layout-sider-dark{
            background: ${({ theme }) => theme[theme.mainContent]['white-background']};
            .ant-layout-sider-children{
                .ant-menu{
                    .ant-menu-submenu-inline{
                        > .ant-menu-submenu-title{
                            padding: 0 20px !important;
                        }
                    }
                    .ant-menu-item{
                        padding: 0 20px !important;
                    }
                }
            }
        }
        
        .ant-layout-sider-children{
            padding-bottom: 15px;
            
            .ninjadash-sidebar-nav-title {
                display: flex;
                font-size: 12px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: ${({ theme }) => theme[theme.mainContent]['light-text']};
                padding: 0 ${({ theme }) => (theme.rtl ? '20px' : '15px')} 0 0;
                margin: 20px 0 0 0;
            }

            .ninjadash-sidebar-nav-title{
                &.ninjadash-sidebar-nav-title-top{
                    margin: 8px 0 0;
                }
            }

            .ant-menu{
                font-size: 14px;
                overflow-x: hidden;
                ${({ theme }) => (theme.rtl ? 'border-left' : 'border-right')}: 0 none;
                &.ant-menu-dark, &.ant-menu-dark .ant-menu-sub, &.ant-menu-dark .ant-menu-inline.ant-menu-sub {
                    background-color: ${({ theme }) => theme[theme.mainContent]['light-background']};
                    
                }
                .ant-menu-sub.ant-menu-inline{
                    background-color: ${({ theme }) => theme[theme.mainContent]['white-background']};
                }
                
                .ant-menu-submenu-selected{
                    color: ${({ theme }) => theme[theme.mainContent]['light-text']};
                }
                .ant-menu-submenu, 
                .ant-menu-item{
                    ${({ theme }) => (!theme.rtl ? 'padding-right' : 'padding-left')}: 5px;
                    &.ant-menu-item-selected{
                        border-radius: 0 21px 21px 0;
                        background-color: ${({ theme }) => theme[theme.mainContent]['menu-active-bg']};
                        &:after{
                            content: none;
                        }
                        a{
                            color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                        }
                    }
                    &.ant-menu-submenu-active{
                        >svg,
                        >.ant-menu-submenu-title .ant-menu-title-content{
                            color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                        }

                        >.ant-menu-submenu-title{
                            .ant-menu-submenu-arrow:before,
                            .ant-menu-submenu-arrow:after{
                                background-color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                            }
                            svg{
                                color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                            }
                        }
                    }
                    &.ant-menu-item-active{
                        .ant-menu-item-icon{
                            svg{
                                color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                            }
                        }
                        svg{
                            color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                        }
                        .ant-menu-title-content{
                            a{
                                color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                            }
                        }
                    }
                    .ant-menu-item-icon{
                        svg{
                            transition: color 0.3s;
                        }
                    }
                    svg,
                    img{
                        width: 16px;
                        font-size: 16px;
                        color: ${({ theme }) => theme[theme.mainContent]['menu-icon-color']};
                    }
                    span{
                        display: inline-block;
                        transition: 0.3s ease;
                    }
                    .ant-menu-title-content{
                        ${({ theme }) => (!theme.rtl ? 'padding-left' : 'padding-right')}: 16px;
                    }
                }
                .ant-menu-item{
                    .menuItem-iocn{
                        width: auto;
                    }
                    &:not(:last-child){
                        margin-bottom: 0;
                    }
                    a{
                        color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
                    }
                }
                .ant-menu-submenu{
                    &.ant-menu-submenu-open{
                        >.ant-menu-submenu-title{
                            display: flex;
                            align-items: center;
                            .title{
                                padding-left: 0;
                            }
                            .badge{
                                ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 45px;
                            }
                            span{
                                font-weight: 500;
                                color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                            }
                            svg,
                            i,
                            .ant-menu-submenu-arrow{
                                color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                                &:after,
                                &:before{
                                    background: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                                }
                            }
                        }
                        .ant-menu-sub{
                            .ant-menu-item{
                                &.ant-menu-item-selected{
                                    background-color: ${({ theme }) => theme[theme.mainContent]['menu-active-bg']};
                                    border-radius: ${({ theme }) => (!theme.rtl ? '0 21px 21px 0' : '21px 0 0 21px')};
                                    a{
                                        font-weight: 500;
                                        color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                                    }
                                }
                            }
                        }
                    }
                    .ant-menu-submenu-title{
                        .ant-menu-title-content{
                            font-weight: 500;
                            color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
                        }
                    }
                }
                
                .ant-menu-item,
                .ant-menu-submenu-title{
                    margin: 0 !important;
                    &:active{
                        background-color: transparent;
                    }
                    a{
                        font-size: 14px;
                        font-weight: 500;
                        color: ${({ theme }) => theme['gray-text']};
                        position: relative;
                    }
                    >span{
                        width: 100%;
                        margin-left: 0;
                        .pl-0{
                            ${({ theme }) => (theme.rtl ? 'padding-right' : 'padding-left')}: 0px;
                        }
                    }
                    .badge{
                        position: absolute;                        
                        ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 30px;
                        top: 50%;
                        transform: translateY(-50%);
                        display: inline-block;
                        height: auto;
                        font-size: 10px;
                        border-radius: 3px;
                        padding: 3px 4px 4px;
                        line-height: 1;
                        letter-spacing: 1px;
                        color: #fff;
                        &.badge-primary{
                            background-color: ${({ theme }) => theme['primary-color']};
                        }
                        &.badge-success{
                            background-color: ${({ theme }) => theme['success-color']};
                        }
                    }
                }
                
                .ant-menu-submenu-inline{
                    > .ant-menu-submenu-title{
                        display: flex;
                        align-items: center;
                        padding: 0 15px !important;
                        margin: 0;
                        svg,
                        img{
                            width: 16px;
                            height: 16px;
                        }
                                                
                        .ant-menu-submenu-arrow{
                            right: auto;
                            ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 15px;
                            &:after,
                            &:before{
                                width: 6px;
                                background: #868EAE;
                                height: 1.2px;
                            }
                            &:before{
                                transform: rotate(45deg) ${({ theme }) =>
        !theme.rtl ? 'translateY(-3px)' : 'translateY(3px)'};
                            }
                            &:after{
                                transform: rotate(-45deg) ${({ theme }) =>
        theme.rtl ? 'translateY(-3px)' : 'translateY(3px)'};
                            }
                        }
                    }
                    &.ant-menu-submenu-open{
                        > .ant-menu-submenu-title{
                            .ant-menu-submenu-arrow{
                                transform: translateY(2px);
                                &:before{
                                    transform: rotate(45deg) translateX(-3.3px);
                                }
                                &:after{
                                    transform: rotate(-45deg) translateX(3.3px);
                                }
                            }
                        }
                    }
                    .ant-menu-item{
                        ${({ theme }) => (theme.rtl ? 'padding-right' : 'padding-left')}: 0 !important;
                        transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;
                        a{
                            ${({ theme }) => (theme.rtl ? 'padding-right' : 'padding-left')}: 36px !important;
                        }
                    }
                }
                .ant-menu-item{
                    display: flex;
                    align-items: center;
                    padding: 0 15px !important;
                    a{
                        width: 100%;
                        display: flex !important;
                        align-items: center;
                        text-transform: capitalize;
                        .feather{
                            width: 16px;
                            color: ${({ theme }) => theme['extra-light-color']};
                        }
                        span{
                            ${({ theme }) => (!theme.rtl ? 'padding-left' : 'padding-right')}: 20px;
                            display: inline-block;
                            color: ${({ theme }) => theme['dark-color']};
                        }
                    }
                    &.ant-menu-item-selected{
                        svg,
                        i{
                            color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                        }
                    }
                }
                
                
                &.ant-menu-inline-collapsed{
                    .ant-menu-submenu{
                        text-align: ${({ theme }) => (!theme.rtl ? 'left' : 'right')};                        
                        .ant-menu-submenu-title{
                            padding: 0 20px;
                            justify-content: center;
                        }
                    }
                    .ant-menu-item{
                        padding: 0 20px !important;
                        justify-content: center;
                    }
                    .ant-menu-submenu, .ant-menu-item{
                        span{
                            display: none;
                        }
                    }
                }
            }
        }
    }
    @media only screen and (max-width: 1150px){
        .ant-layout-sider.ant-layout-sider-collapsed{
            ${({ theme }) => (!theme.rtl ? 'left' : 'right')}: -80px !important;
        }

    }

    .atbd-main-layout{
        ${({ theme }) => (!theme.rtl ? 'margin-left' : 'margin-right')}: ${({ theme }) =>
        theme.topMenu ? 0 : '280px'};
        margin-top: 74px;
        transition: 0.3s ease;
        
        @media only screen and (max-width: 1150px){
            ${({ theme }) => (!theme.rtl ? 'margin-left' : 'margin-right')}: auto !important;
        }
        @media print {
            width: 100%;
            margin-left: 0;
            margin-right: 0;
        }
    }
    .admin-footer{

        background-color: ${({ theme }) => theme[theme.mainContent]['white-background']};
        @media print {
            display: none;
        }
        .admin-footer__copyright{
            display: inline-block;
            width: 100%;
            font-weight: 500;
            color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
            @media only screen and (max-width: 767px){
                text-align: center;
                margin-bottom: 10px;
            }
            a{
                display: inline-block;
                margin-left: 4px;
                font-weight: 500;
                color: ${({ theme }) => theme['primary-color']};
            }
        }
        
    }
    /* Common Styles */
    .ant-radio-button-wrapper-checked {
        &:not(.ant-radio-button-wrapper-disabled){
            background: ${({ theme }) => theme[theme.mainContent].white};
            border-color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
            color: ${({ theme }) => theme[theme.mainContent]['white-text']};
            &:hover{
                border-color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
            }
        }
    }
    .ninjadash-shade{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255,255,255,0);
        content: "";
        z-index: -1;
        &.show{
            z-index: 101;
        }
    }
`;

const SmallScreenAuthInfo = Styled.div`
    background-color: ${({ theme }) => theme[theme.mainContent]['white-background']};
    width: 100%;
    position: fixed;
    margin-top: ${({ hide }) => (hide ? '0px' : '72px')};
    top: 0;
    ${({ theme }) => (!theme.rtl ? 'left' : 'right')}: 0;
    transition: .3s;
    opacity: ${({ hide }) => (hide ? 0 : 1)};
    z-index: ${({ hide }) => (hide ? -1 : 1)};
    box-shadow: 0 2px 30px #9299b810;
    padding: 10px 0;
    @media only screen and (max-width: 767px){
        padding: 10px 15px;
    }
    .ninjadash-nav-actions__searchbar{
        display: none !important;
    }
`;

const SmallScreenSearch = Styled.div`
        background-color: ${({ theme }) => theme[theme.mainContent]['white-background']};
        width: 100%;
        position: fixed;
        margin-top: ${({ hide }) => (hide ? '0px' : '64px')};
        top: 0;
        ${({ theme }) => (!theme.rtl ? 'left' : 'right')}: 0;
        transition: .3s;
        opacity: ${({ hide }) => (hide ? 0 : 1)};
        z-index: ${({ hide }) => (hide ? -1 : 999)};
        box-shadow: 0 2px 30px #9299b810;

`;

const ModeSwitch = Styled.div`
    background: #ddd;
    width: 200px;
    position: fixed;
    ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 0;
    top: 50%;
    margin-top: -100px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    padding: 15px;
    border-radius: 5px;
    button{
        margin-top: 5px;
    }
`;

const TopMenuSearch = Styled.div`
    .top-right-wrap{
        position: relative;
        float: ${({ theme }) => (theme.rtl ? 'left' : 'right')};
    }
    .search-toggle{
        display: flex;
        align-items: center;
        ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 10px;
        color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
        .feather-x{
            display: none;
        }
        .feather-search{
            display: flex;
        }
        &.active{
            .feather-search{
                display: none;
            }
            .feather-x{
                display: flex;
            }
        }
        svg,
        img{
            width: 20px;
        }
    }
    .topMenu-search-form{
        position: absolute;
        ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 100%;
        ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 15px;
        top: 12px;
        background-color: #fff;
        border: 1px solid ${({ theme }) => theme['border-color-normal']};
        border-radius: 6px;
        height: 40px;
        width: 280px;
        display: none;
        &.show{
            display: block;
        }
        .search-icon{
            width: fit-content;
            line-height: 1;
            position: absolute;
            left: 15px;
            ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 15px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 9999;
        }
        i,
        svg{
            width: 18px;
            background-color: ${({ theme }) => theme[theme.mainContent]['gray-light-text']};
        }
        form{
            height: auto;
            display: flex;
            align-items: center;
        }
        input{
            position: relative;
            border-radius: 6px;
            width: 100%;
            border: 0 none;
            height: 38px;
            padding-left: 40px;
            z-index: 999;
            ${({ theme }) => (theme.rtl ? 'padding-right' : 'padding-left')}: 40px;
            &:focus{
                border: 0 none;
                box-shadow: 0 0;
                outline: none;
            }
        }
    }
`;

const TopMenuStyle = Styled.div`
    .ninjadash-top-menu{
        ul{
            margin-bottom: 0;
            li{
                display: inline-block;
                position: relative;
                ${({ theme }) => (theme.rtl ? 'padding-left' : 'padding-right')}: 14px;
                @media only screen and (max-width: 1024px){
                    ${({ theme }) => (theme.rtl ? 'padding-left' : 'padding-right')}: 10px;
                }
                &:not(:last-child){
                    ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 34px;
                    @media only screen and (max-width: 1399px){
                        ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 30px;
                    }
                    @media only screen and (max-width: 1199px){
                        ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 26px;
                    }
                    @media only screen and (max-width: 1024px){
                        ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 16px;
                    }
                }
                .parent.active{
                    color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                }
                &.has-subMenu{
                    >a{
                        position: relative;
                        &:before{
                            position: absolute;
                            ${({ theme }) => (theme.rtl ? 'left' : 'right')}: -14px;
                            top: 50%;
                            transform: translateY(-50%);
                            font-family: "FontAwesome";
                            content: '\f107';
                            line-height: 1;
                            color: ${({ theme }) => theme[theme.mainContent]['light-text']};
                        }
                        &.active{
                            &:before{
                                color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                            }
                        }
                    }
                }
                &.has-subMenu-left{
                    >a{
                        position: relative;
                        &:before{
                            position: absolute;
                            ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 30px;
                            top: 50%;
                            transform: translateY(-50%);
                            font-family: "FontAwesome";
                            content: '\f105';
                            line-height: 1;
                            color: ${({ theme }) => theme[theme.mainContent]['light-text']};
                        }
                    }
                }
                &:hover{
                    >.subMenu{
                        top: 70px;
                        opacity: 1;
                        visibility: visible;
                        @media only screen and (max-width: 1399px){
                            top: 40px;
                        }
                    }
                }
                >a{
                    padding: 24px 0;
                    line-height: 1.5;
                    @media only screen and (max-width: 1399px){
                        padding: 6px 0;
                    }
                }
                a{
                    display: flex;
                    align-items: center;
                    font-weight: 500;
                    color: ${({ theme }) => theme[theme.mainContent]['light-text']};
                    &.active{
                        color: ${({ theme }) => theme[theme.mainContent]['light-text']};
                    }
                    svg,
                    img,
                    i{
                        margin-right: 14px;
                        width: 16px;
                    }
                }
                >ul{
                    li{
                        display: block;
                        position: relative;
                        ${({ theme }) => (theme.rtl ? 'padding-left' : 'padding-right')}: 0;
                        ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 0 !important;
                        a{
                            font-weight: 400;
                            padding: 0 30px;
                            line-height: 3;
                            color: #868EAE;
                            transition: .3s;
                            &:hover,
                            &[aria-current="page"]{
                                color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                                background-color: ${({ theme }) => theme[theme.mainContent]['menu-active']}06;
                                ${({ theme }) => (theme.rtl ? 'padding-right' : 'padding-left')}: 40px;
                            }
                        }
                        &:hover{
                            .subMenu{
                                top: 0;
                                ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 250px;
                                @media only screen and (max-width: 1300px){
                                    ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 180px;
                                }
                            }
                        }
                    }
                }
            }
        }
        .subMenu{
            width: 250px;
            background: ${({ theme }) => theme[theme.mainContent]['white-background']};
            border-radius: 6px;
            position: absolute;
            ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 0;
            top: 80px;
            padding: 12px 0;
            visibility: hidden;
            opacity: 0;
            transition: 0.3s;
            z-index: 98;
            box-shadow: 0px 15px 40px 0px rgba(82, 63, 105, 0.15);
            @media only screen and (max-width: 1300px){
                width: 180px;
            }
            .subMenu{
                width: 250px;
                background:${({ theme }) => theme[theme.mainContent]['white-background']};
                position: absolute;
                ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 250px;
                top: 0px;
                padding: 12px 0;
                visibility: hidden;
                opacity: 0;
                transition: 0.3s;
                z-index: 98;
                box-shadow: 0px 15px 40px 0px rgba(82, 63, 105, 0.15);
                @media only screen and (max-width: 1300px){
                    width: 200px;
                    ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 180px;
                }
            }
        }
    }
    .ninjadash-top-menu{
        >ul{
            display: flex;
            flex-wrap: wrap;
        }
    }
    // Mega Menu
    .ninjadash-top-menu{
        >ul{
            >li{
                &:hover{
                    .megaMenu-wrapper{
                        opacity: 1;
                        visibility: visible;
                        z-index: 99;
                    }
                }
                &.mega-item{
                    position: static;
                }
                .sDash_menu-item-icon{
                    line-height: .6;
                }
                .megaMenu-wrapper{
                    display: flex;
                    position: absolute;
                    text-align: ${({ theme }) => (theme.rtl ? 'right' : 'left')}
                    ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 0;
                    top: 100%;
                    overflow: hidden;
                    z-index: -1;
                    padding: 16px 0;
                    box-shadow: 0px 15px 40px 0px rgba(82, 63, 105, 0.15);
                    border-radius: 0 0 6px 6px;
                    opacity: 0;
                    visibility: hidden;
                    transition: .4s;
                    background-color: ${({ theme }) => theme[theme.mainContent]['white-background']};
                    &.megaMenu-small{
                        width: 590px;
                        >li{
                            flex: 0 0 33.3333%;
                        }
                        ul{
                            li{
                                >a{
                                    padding: 0 35px;
                                    position: relative
                                    &:after{
                                        width: 5px;
                                        height: 5px;
                                        border-radius: 50%;
                                        position: absolute;
                                        ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 30px;
                                        top: 50%;
                                        transform: translateY(-50%);
                                        background-color: #C6D0DC;
                                        content: '';
                                        transition: .3s;
                                    }
                                    &:hover,
                                    &[aria-current="page"]{
                                        ${({ theme }) => (theme.rtl ? 'padding-right' : 'padding-left')}: 35px;
                                        color: ${({ theme }) => theme['primary-color']};
                                        &:after{
                                            background-color: ${({ theme }) => theme['primary-color']};;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    &.megaMenu-wide{
                        width: 1000px;
                        padding: 5px 0 18px;
                        @media only screen and (max-width: 1599px){
                            width: 800px;
                        }
                        @media only screen and (max-width: 1399px){
                            width: 700px;
                        }
                        >li{
                            position: relative;
                            flex: 0 0 25%;
                            .mega-title{
                                position: relative;
                                font-size: 14px;
                                font-weight: 500;
                                padding-left: 35px;
                                ${({ theme }) => (theme.rtl ? 'padding-right' : 'padding-left')}: 45px;
                                color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                                &:after{
                                    position: absolute;
                                    height: 5px;
                                    width: 5px;
                                    border-radius: 50%;
                                    ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 30px;
                                    top: 50%;
                                    transform: translateY(-50%);
                                    background-color: #C6D0DC;
                                    content: '';
                                }
                            }
                        }
                    }
                    ul{
                        li{
                            position: relative;
                            &:hover{
                                >a{
                                    padding-left: 35px;
                                }
                                &:after{
                                    opacity: 1;
                                    visibility: visible;
                                }
                            }
                            >a{
                                line-height: 3;
                                color: #868EAE;
                                font-weight: 400;
                                transition: .3s;
                            }
                            
                            &:after{
                                width: 6px;
                                height: 1px;
                                border-radius: 50%;
                                position: absolute;
                                ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 20px;
                                top: 50%;
                                transform: translateY(-50%);
                                background-color: ${({ theme }) => theme[theme.mainContent]['gray-light-text']};
                                content: '';
                                transition: .3s;
                                opacity: 0;
                                visibility: hidden;
                            }
                        }
                    }
                }
            }
        }
    }
`;

const FooterStyle = Styled(Footer)`
    padding: 20px 30px 18px;    
    font-size: 14px;
    background-color: ${({ theme }) => theme[theme.mainContent]['light-background']};
    width: 100%;
    box-shadow: 0 -5px 10px rgba(146,153,184, 0.05);   
    
    .admin-footer__links{
        margin: 0 -9px;
        text-align: ${({ theme }) => (theme.rtl ? 'left' : 'right')};
        @media only screen and (max-width: 767px){
            text-align: center;
        }
        a {
            margin: 0 9px;
            color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
            &:hover{
                color: ${({ theme }) => theme['primary-color']};
            }
            &:not(:last-child) {
                ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 15px;
            }

            
        }
    }
    
`;

const OverviewCardWrap = Styled.div`
    margin-bottom: 25px;
    .ant-card {
        background-color: ${({ theme }) => theme[theme.mainContent]['white-background']};
        &.ninjadash-overview-halfCircle-card{
            overflow: hidden;
            .ant-card-body {
                padding: 24px 25px 12px !important;
                .ninjadash-overview-card {
                    .ninjadash-overview-card__bottom {
                        margin-top: 0;
                        .ninjadash-overview-status{
                            background-color: transparent;
                            padding: 0;
                        }
                    }
                    .ninjadash-overview-card__top--icon{
                        position: absolute;
                        top: -9px;
                        right: -38%;
                        width: 230px;
                        height: 168px;
                        border-radius: 100%;
                        padding: 0 30px;
                        justify-content: flex-start;
                        @media only screen and (max-width: 1699px){
                            right: -48%;
                        }
                        @media only screen and (max-width: 1599px){
                            right: -20%;
                            top: -12px;
                        }
                        @media only screen and (max-width: 1399px){
                            right: -24%;
                            top: -15px;
                        }
                        @media only screen and (max-width: 991px){
                            right: -35%;
                        }
                        @media only screen and (max-width: 767px){
                            right: -46%;
                            padding: 0 18px;
                        }
                        @media only screen and (max-width: 650px){
                            right: -56%;
                        }
                        @media only screen and (max-width: 575px){
                            right: -30%;
                        }
                        @media only screen and (max-width: 475px){
                            right: -44%;
                            top: -17px;
                        }
                        @media only screen and (max-width: 375px){
                            right: -48%;
                        }
                        svg{
                            width: 40px;
                            @media only screen and (max-width: 767px){
                                width: 30px;
                            }
                        }
                    }
                    .ninjadash-overview-card__top--content{
                        .ninjadahs-overview-label{
                            display: block;
                            margin-bottom: 4px;
                            font-size: 15px;
                        }
                    }
                }
            }
        }
    }
    .ant-card-body{
        padding: 25px !important;
        @media only screen and (max-width: 767px){
            padding: 20px !important;
        }
        @media only screen and (max-width: 575px){
            padding: 15px !important;
        }
        .ninjadash-overview-total {
            color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
        }
        .ninjadash-overview-card{
            .ninjadash-overview-card__top{
                .ninjadash-overview-card__top--icon{
                    width: 58px;
                    height: 58px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 14px;
                    @media only screen and (max-width: 767px){
                        width: 48px;
                        height: 48px;
                    }
                    div{
                        line-height: 1;
                    }
                    svg,
                    img{
                        width: 24px;
                        height: 24px;
                    }
                    &.ninjadash-primary{
                        background-color: ${({ theme }) => theme['primary-color']}15;
                        svg path,
                        i{
                            fill: ${({ theme }) => theme['primary-color']};
                        }
                    }
                    &.ninjadash-secondary{
                        background-color: ${({ theme }) => theme['secondary-color']}15;
                        svg path,
                        i{
                            fill: ${({ theme }) => theme['secondary-color']};
                        }
                    }
                    &.ninjadash-success{
                        background-color: ${({ theme }) => theme['success-color']}15;
                        svg path,
                        i{
                            fill: ${({ theme }) => theme['success-color']};
                        }
                    }
                    &.ninjadash-warning{
                        background-color: ${({ theme }) => theme['warning-color']}15;
                        svg path,
                        i{
                            fill: ${({ theme }) => theme['warning-color']};
                        }
                    }
                    &.ninjadash-info{
                        background-color: ${({ theme }) => theme['info-color']}15;
                        svg path,
                        i{
                            fill: ${({ theme }) => theme['info-color']};
                        }
                    }
                }
                .ninjadash-overview-card__top--content{
                    .ninjadash-overview-total{
                        font-size: 30px;
                        line-height: 1.45;
                        font-weight: 600;
                        margin-bottom: 0;
                        color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                        @media only screen and (max-width: 1599px){
                            font-size: 24px;
                        }
                        @media only screen and (max-width: 1399px){
                            font-size: 20px;
                        }
                    }
                    .ninjadahs-overview-label{
                        font-size: 15px;
                        font-weight: 400;
                        color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
                        @media only screen and (max-width: 767px){
                            font-size: 15px;
                        }
                    }
                }
                &.ninjadash-overview-card-theme-2{
                    .ninjadash-overview-card__top--icon{
                        order: 2;
                    }
                }
            }
            .ninjadash-overview-card__bottom{
                margin-top: 12px;
                .ninjadash-overview-status{
                    display: inline-flex;
                    align-items: center;
                    width: 100%;
                    padding: 0 10px;
                    min-height: 44px;
                    border-radius: 8px;
                    background-color: ${({ theme }) => theme[theme.mainContent]['status-background']};
                    span{
                        font-size: 14px;
                    }
                    .ninjadash-status-label{
                        ${({ theme }) => (!theme.rtl ? 'margin-left' : 'margin-right')}: 10px;
                        color: ${({ theme }) => theme[theme.mainContent]['gray-light-text']};
                    }
                    .ninjadash-status-rate{
                        display: flex;
                        align-items: center;
                        font-weight: 500;
                        svg,
                        img{
                            width: 20px;
                            ${({ theme }) => (!theme.rtl ? 'margin-right' : 'margin-left')}: -1px;
                        }
                    }
                    &.ninjadash-status-growth{
                        .ninjadash-status-rate{
                            color: ${({ theme }) => theme['success-color']};
                        }
                    }
                    &.ninjadash-status-down{
                        .ninjadash-status-rate{
                            color: ${({ theme }) => theme['danger-color']}
                        }
                    }
                }
            }
        }
    }
    &.ninjadash-overview-card-support{
        .ant-card-body{
            padding: 40.5px 25px !important;
        }
    }
`;

const OverviewDataStyleWrap = Styled.div`
    
    &.card-mesh-wrap{
        justify-content: space-between;
        margin-bottom: 25px;
        border-radius: 10px;
        background-color: ${({ theme }) => theme[theme.mainContent]['white-background']};
        @media only screen and (max-width: 991px){
            flex-wrap: wrap;
        }
        .ninjadash-overview-card-single{
            flex: 0 0 auto;
            margin-bottom: 0;
            @media only screen and (max-width: 991px){
                flex: 0 0 50%;
            }
            @media only screen and (max-width: 575px){
                flex: 0 0 100%;
            }
        }

    }
`;

const ChartContainer = Styled.div`
    display: block;
    font-family: 'Jost', sans-serif;
    &.ninjadash-chart-pie{
        .chartjs-tooltip {
            padding: 4px !important;
            table tbody td{
                color: #000;
            }
        }
    }
    .chart-divider {
        display: block;
        width: 100%;
        height: 100px;
    }
    .chartjs-tooltip {
        opacity: 1;
        position: absolute;
        background: ${({ theme }) => theme[theme.mainContent]['white-background']};
        box-shadow: 0 3px 16px #ADB5D915;
        padding: 8px 6px !important;
        border-radius: 5px;
        border: 1px solid ${({ theme }) => theme[theme.mainContent]['border-color-default']};
        min-width: 80px;
        transition: all 0.5s ease;
        pointer-events: none;
        transform: translate(-50%, 5%);
        z-index: 222;
        top: 0;
        left: 0;
        @media only screen and (max-width: 991px){
            // transform: translate(-60%, 5%);
        }
        &:before {
            position: absolute;
            content: '';
            border-top: 5px solid ${({ theme }) => theme[theme.mainContent]['dark-background']};
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            bottom: -5px;
            ${({ theme }) => (!theme.rtl ? 'left' : 'right')}: 50%;
            // transform: translateX(-50%);
        }
    }
    .chartjs-tooltip-key {
        display: inline-block;
        width: 10px;
        height: 10px;
        background: "pink";
        ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}
        : 5px;
    }
    .tooltip-title {
        color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
        font-size: 12px;
        line-height: 1;
        font-weight: 500 !important;
        font-family: 'Jost', sans-serif;;
        text-transform: capitalize;
        margin-bottom: 4px;
    }
    .tooltip-value {
        color: #63b963;
        font-size: 22px;
        font-weight: 600 !important;
        font-family: 'Jost', sans-serif;;
    }
    .tooltip-value sup {
        font-size: 12px;
        @media only screen and (max-width: 1199px){
            font-size: 11px;
        }
    }
    table{
        tbody{
            td{
                font-size: 12px;
                font-weight: 500;
                padding-bottom: 3px;
                color: ${({ theme }) => theme[theme.mainContent]['extra-light-text']};
                .data-label{
                    ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: 3px;
                    color: ${({ theme }) => theme[theme.mainContent]['light-gray-text']};
                }
            }
        }
    }
`;

const SalesRevenueWrapper = Styled.div`
    .ninjadash-sales-revenue-lineChart{
        margin: ${({ theme }) => (!theme.rtl ? '0 -4px 0 0' : '0 0 0 -4px')};
    }
    .ninjadash-chart-top{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: -12px;
        @media only screen and (max-width: 767px) {
            flex-direction: column;
            margin: -6px;
        }
    }
    #ninjadash-sales-revenue{
        margin-top: 12px;
    }
    .ninjadash-chart-top__item{
        position: relative;
        display: flex;
        align-items: center;
        margin: 12px;
        padding-left: 12px;
        @media only screen and (max-width: 767px) {
            margin: 6px;
        }
        &:before{
            position: absolute;
            width: 7px;
            height: 7px;
            left: 0;
            top: 50%;
            border-radius: 50%;
            content: '';
            // transform: translateY(-50%);
        }
        &.ninjadash-chart-top__item-order{
            &:before{
                background-color: ${({ theme }) => theme['primary-color']};
            }
            
        }
        &.ninjadash-chart-top__item-sale{
            &:before{
                background-color: ${({ theme }) => theme['info-color']};
            }
           
        }
        .ninjadash-chart-top__item--text{
            font-size: 14px;
            font-weight: 400;
            color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
        }
        .ninjadash-chart-top__item--amount{
            display: inline-block;
            font-size: 22px;
            font-weight: 600;
            margin: 0 5px 0 10px;
            color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
            @media only screen and (max-width: 767px) {
                font-size: 18px;
            }
        }
        .ninjadash-chart-top__item--status{
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
            svg{
                height: 20px;
                width: 20px;
            }
            &.status-growth{
                color: ${({ theme }) => theme['success-color']};
                svg{
                    path{
                        fill: ${({ theme }) => theme['sucess-color']};
                    }
                }
            }
            &.status-down{
                color: ${({ theme }) => theme['danger-color']};
                svg{
                    path{
                        fill: ${({ theme }) => theme['danger-color']};
                    }
                }
            }
        }
    }
`;

const CardBarChart = Styled.div`
    .ninjadash-chart-top{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: -6px -12px;
        @media only screen and (max-width: 767px) {
            flex-direction: column;
            align-items: center !important;
            margin: -6px;
        }
    }
    .ninjadash-chart-top__item{
        position: relative;
        display: flex;
        align-items: center;
        margin: 12px;
        @media only screen and (max-width: 767px) {
            margin: 6px;
        }
        .ninjadash-chart-top__item--label{
            position: relative;
            padding-left: 14px;
        }
        .ninjadash-chart-top__item--tika{
            position: absolute;
            left: 0;
            top: 50%;
            display: block;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            // transform: translateY(-50%);
        }
        .ninjadash-chart-top__item--amount{
            display: inline-block;
            font-size: 18px;
            font-weight: 600;
            line-height: 1.2;
            margin: 0 5px 0 0;
            color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
        }
        .ninjadash-chart-top__item--status{
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
            svg{
                height: 20px;
                width: 20px;
            }
            &.status-growth{
                color: ${({ theme }) => theme['success-color']};
                svg{
                    path{
                        fill: ${({ theme }) => theme['sucess-color']};
                    }
                }
            }
            &.status-down{
                color: ${({ theme }) => theme['danger-color']};
                svg{
                    path{
                        fill: ${({ theme }) => theme['danger-color']};
                    }
                }
            }
        }
    }
    &.ninjadash-chart-container-overview{
        .ninjadash-chart-top{
            margin-top: -35px;
            @media only screen and (max-width: 767px) {
                margin-top: 0;
            }
        }
        .ninjadash-chart-top__item{
            .ninjadash-chart-top__item--label{
                font-size: 14px;
                ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 8px;
            }
        }
    }
    &.ninjadash-profitGroth-barCHar-wrap{
        // min-height: 310px;
        @media only screen and (max-width: 1499px) {
            // min-height: 348px;
        }
        @media only screen and (max-width: 1399px) {
            // min-height: 288px;
        }
    }
    >div{
        @media only screen and (max-width: 575px) {
            flex-flow: column;
            align-items: flex-start !important;
            ul{
                margin: 0 0 15px;
            }
        }
    }
    .card-bar-top{
        &.flex-grid{
            ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: -20px;
            @media only screen and (max-width: 575px) {
                flex-flow: column;
                align-items: center;
            }
            h1{
                font-size: 24px;
                margin-bottom: 22px;
                @media only screen and (max-width: 1199px) {
                    font-size: 20px;
                }
            }
        }
        .flex-grid-child{
            padding: 0 20px;
        }
        p{
            font-size: 14px;
            margin-bottom: 8px;
            color: ${({ theme }) => theme[theme.mainContent]['light-text']};
        }
        h1{
            margin-bottom: 18px;
            sub{
                bottom: 0;
                font-size: 14px;
                ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: 8px;
                color: ${({ theme }) => theme['success-color']};
                svg{
                    ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 4px;
                }
            }
        }
        .profitGrowth-list{
            text-align: center;
            @media only screen and (max-width: 575px) {
                margin-top: 6px;
            }
            .custom-label{
                font-size: 14px
            }
        }
    }
    .ninjadash-chartdata-list{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 5px;
        li{
            display: inline-flex;
            align-items: center;
            font-size: 14px;
            text-transform: capitalize;
            color: ${({ theme }) => theme[theme.mainContent]['extra-light-text']};
            &:not(:last-child){
                ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 16px;
            }
        }
    }
    .chartjs-tooltip{
        min-width: 140px !important;
        @media only screen and (max-width: 1199px){
            min-width: 115px !important;
        }
    }
    .deals-barChart{
        display: flex;
        .card-bar-top{
            &:not(:last-child){
                ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 30px;
            }
        }
        h4{
            font-weight: 400;
            color: ${({ theme }) => theme[theme.mainContent]['light-gray-text']};
            p{
                &.growth-down{
                    .deal-percentage{
                        color: ${({ theme }) => theme['danger-color']};
                    }
                }
                &.growth-up{
                    .deal-percentage{
                        color: ${({ theme }) => theme['success-color']};
                    }
                }
                .deal-percentage{
                    svg,
                    img,
                    i{
                        ${({ theme }) => (!theme.rtl ? 'margin-right' : 'margin-left')}: 3px;
                    }
                }
                .deal-value{
                    font-size: 22px;
                    font-weight: 600;
                    margin-right: 8px;
                    ${({ theme }) => (!theme.rtl ? 'margin-right' : 'margin-left')}: 8px;
                    color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                }
            }
        }
    }
    .deals-list{
        .custom-label{
            font-size: 14px;
            &:not(:last-child){
                ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 30px;
            }
        }
    }
`;

const LocationTableWrap = Styled.div`
    max-height: 260px;
    margin-bottom: 30px;
    direction: ltr;
    border: 1px solid ${({ theme }) => theme[theme.mainContent]['light-border']};
    .ant-table {
        background: transparent !important;
    }
    .ant-table-thead{
        > tr > th{
            color: ${({ theme }) => theme[theme.mainContent]['light-text']};
        }
    }
    table{
        tr{
            &:hover {
                td {

                    background-color: ${({ theme }) => theme[theme.mainContent]['light-background']} !important;
                }
            }
            &:first-child{
                td{
                    padding-top: 15px;
                }
            }
            &:last-child{
                td{
                    padding-bottom: 15px;
                }
            }
            th{
                font-size: 12px;
                font-weight: 500;
                text-transform: uppercase;
                color: ${({ theme }) => theme[theme.mainContent]['gray-light-text']};
                background-color: ${({ theme }) => theme[theme.mainContent]['light-background']};
                border-color: ${({ theme }) => theme[theme.mainContent]['light-background']};
                padding: 10.5px 20px;
            }
            td{
                font-size: 15px;
                border: 0 none;
                padding: 10.5px 20px;
                color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                
                &:first-child{
                    font-weight: 500;
                    color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                }
            }
            th,
            td{
                &:last-child{
                    ${({ theme }) => (!theme.rtl ? 'padding-right' : 'padding-left')}: 40px;
                    text-align: right;
                }
            }
        }
    }
    .ninjadash-track-vertical{
        position: absolute;
        width: 6px;
        transition: opacity 200ms ease 0s;
        opacity: 0;
        ${({ theme }) => (!theme.rtl ? 'right' : 'left')}: 6px;
        bottom: 2px;
        top: 2px;
        border-radius: 6px;
        >div{
            background-color: ${({ theme }) => theme[theme.mainContent]['scroll-bg']} !important;
        }
    }
`;

const SaleLocationMap = Styled.div`
    text-align: center;
    height: 100%;
    margin-bottom: 55px;
    .__react_component_tooltip {
        background: #fff;
        color: #010413;
        font-weight: 500;
        border-radius: 3px;
        box-shadow: 0 10px 15px ${({ theme }) => theme[theme.mainContent]['light-text']}15;
        &:after{
            border-top-color: #fff !important;
        }
    }
    >div{
        width: 100%;
        height: 250px;
        overflow: hidden;
        @media only screen and (max-width: 479px){
            height: 200px;
        }
    }
    svg{
        width: 450px;
        @media only screen and (max-width: 479px){
            height: 180px;
        }
        @media only screen and (max-width: 440px){
            width: 310px;
        }
        @media only screen and (max-width: 320px){
            width: 280px;
        }
    }
    .controls{
        position: absolute;
        ${({ theme }) => (!theme.rtl ? 'right' : 'left')}: 20px;
        bottom: 10px;
        button{
            display: block;
            width: 27px;
            height: 27px;
            background: none;
            color: ${({ theme }) => theme[theme.mainContent]['white-text']};
            border: 1px solid ${({ theme }) => theme[theme.mainContent]['border-color-default']};
            padding: 0;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${({ theme }) => theme[theme.mainContent]['white-background']};
            cursor: pointer;
            &:first-child{
                border-radius: 6px 6px 0 0;
            }
            &:last-child{
                border-radius: 0 0 6px 6px;
            }
            &:focus{
                outline: none;
            }
            svg{
                width: 10px;
                color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
            }
        }
        button + button{
            border-top: 0 none;
        }
    }
`;

const TopSellerWrap = Styled.div`
    .ant-table {
        background: transparent !important;
    }
    .top-seller-table {
        min-height: auto;
        .product-info{
            .product-img{
                ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 10px;
            }
            .product-name{
                text-transform: capitalize;
                font-size: 15px;
                font-weight: 500;
                color: ${({ theme }) => theme[theme.mainContent]['dark-text']}
            }
        }
        .ant-table-thead {
            th {
                background: ${({ theme }) => theme[theme.mainContent]['light-background']};
            }
        }
        .ant-table-row,
        tr {
            .ant-table-cell{
                color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                &:not(:first-child){ 
                    text-align: right;
                }

            }
        }
    }
`;

const BrowserStateWrap = Styled.div`
    .ant-table {
        min-height: 310px;
        background: transparent !important;

        .ant-table-thead {
            th {
                background: ${({ theme }) => theme[theme.mainContent]['light-background']};
                &:not(:first-child){
                    text-align: right;
                }
            }
        }
        .ant-table-row {
            .ant-table-cell{
                color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                &:not(first-child){ 
                    text-align: right;
                }
            }
        }
    }
    .ninjadash-product-info{
        .ninjadash-product-img{
            ${({ theme }) => (!theme.rtl ? 'margin-right' : 'margin-left')}: 12px;
            img{
                max-width: 31px;
            }
        }
        .ninjadash-product-name{
            font-size: 15px;
            text-transform: capitalize;
            font-weight: 500;
            color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
        }
    }
`;

const MixedCardWrap = Styled.div`
  .location-map >div{
    @media only screen and (max-width: 767px){
      height: 100%;
    }
  }
`;

const NewsletterStyle = Styled.figure`
    &.ninjadash-newsletter-theme-2{
        min-height: 135px;
        padding: 15px 0 15px 25px;
        justify-content: flex-start;
        figcaption{
            ${({ theme }) => (!theme.rtl ? 'margin-left' : 'margin-right')}: 15px;
        }
    }
    ${({ theme }) => `
        background-color: ${theme[theme.mainContent]['white-background']};
        padding: 25px 0 25px 25px;
        text-align: left;
        border-radius: 10px;
        box-shadow: 0px 5px 20px rgba(173,181,273,.05);
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 25px;
        min-height: 160px;
        @media only screen and (max-width: 575px){
            padding: 15px;
            flex-direction: column;
        }

        figcaption {
            margin-right: 15px;
            @media only screen and (max-width: 1699px){
                margin-right: 10px; 
            }
            @media only screen and (max-width: 575px){
                margin-top: 15px;
                ${!theme[theme.rtl] ? 'margin-right' : 'margin-left'}: 0;
                text-align: center;
            }
            h2,
            h4 {
                font-size: 24px;
                font-weight: 600;
                line-height: 1;
                margin: 0 0 10px;
                color: ${theme[theme.mainContent]['dark-text']};
                @media only screen and (max-width: 575px){
                    font-size: 20px;
                }
            }
            h4{
                font-size: 20px;
            }
            p {
                font-size: 15px;
                margin-bottom: 0;
                color: ${theme[theme.mainContent]['gray-text']}
            }
            button{
                margin-top: 14px;
            }
        }
        img{
            margin-bottom: -16px;
            margin-top: -24px;
            max-width: 150px;
            @media only screen and (max-width: 1699px){
                max-width: 100px;
            }
            @media only screen and (max-width: 575px){
                margin-bottom: 0;
                margin-top: 15px;
            }
        }
    `}
`;

const OrderSummary = Styled.div`
    max-width: 650px;
    margin: 0 auto;
    .ant-card{
        margin-bottom: 0 !important;
    }
    .ant-card-body{
        box-shadow: 0 10px 30px ${({ theme }) => theme[theme.mainContent]['dark-text']}10;
    }
    .ant-form-item{
        margin-bottom: 0;
        .ant-form-item-control-input-content{
            input{
                background-color: ${({ theme }) => theme[theme.mainContent]['input-bg']};
                border-color: ${({ theme }) => theme[theme.mainContent]['border-color-secondary']};
            }
        }
    }

    .summary-table-title{
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 25px;
        color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
    }
    .order-summary-inner{
        padding-bottom: 5px;
        @media only screen and (max-width: 1599px){
            max-width: 600px;
            margin: 0 auto;
        }
        .ant-select{
            color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
            .ant-select-selector{
                background-color: ${({ theme }) => theme[theme.mainContent]['white-background']} !important;
            }
            .ant-select-selection-item{
                font-weight: 500;
                img{
                    position: relative;
                    top: -1px;
                }
            }
            .ant-select-arrow{
                color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
            }
        }
    }
    .invoice-summary-inner{
        .summary-list{
            margin: 22px 0;
            li{
                &:not(:last-child){
                    margin-bottom: 12px;
                }
            }
        }
        .summary-total-amount{
            color: ${({ theme }) => theme['primary-color']} !important;
        }
    }

    .summary-list{
        li{
            display: flex;
            justify-content: space-between;
            &:not(:last-child){
                margin-bottom: 18px;
            }
            span{
                font-weight: 500;
            }
            .summary-list-title{
                color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
            }
            .summary-list-text{
                color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
            }
        }
    }
    .ant-select-focused.ant-select-single{
        .ant-select-selector{
            box-shadow: 0 0 !important;
        }
    }
    .ant-select-single{
        margin-top: 18px;
        .ant-select-selection-search-input{
            height: fit-content;
        }
        .ant-select-selector{
            padding: 0 !important;
            border: 0 none !important;
            color: ${({ theme }) => theme['success-color']};
        }
        .ant-select-arrow{
            ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 0;
        }
    }
    .promo-apply-form{
        display: flex;
        align-items: flex-end;
        margin: 5px 0 18px;
        @media only screen and (max-width: 479px){
            flex-flow: column;
            align-items: flex-start;
        }
        .ant-form-item{
            margin-bottom: 0;
        }
        .ant-row{
            flex: auto;
            flex-flow: column;
        }
        .ant-form-item-label{
            text-align: ${({ theme }) => (!theme.rtl ? 'left' : 'right')};
            label{
                font-weight: 400;
                margin-bottom: 4px;
                height: fit-content;
                color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
            }
        }
        .ant-form-item-control-input-content{
            display: flex;
            @media only screen and (max-width: 479px){
                flex-flow: column;
            }
            input{
                margin: ${({ theme }) => (theme.rtl ? '0 0 0px 6px' : '0 6px 0px 0')};
                height: 40px;
                @media only screen and (max-width: 479px){
                    margin: ${({ theme }) => (theme.rtl ? '0 0 10px 6px' : '0 6px 10px 0')};
                    width: 100% !important;
                }
            }
            button{
                height: 40px;
            }
        }
    }
    .summary-total{
        display: inline-flex;
        justify-content: space-between;
        width: 100%;
        .summary-total-label{
            font-size: 16px;
            font-weight: 500;
            color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
        }
        .summary-total-amount{
            font-size: 18px;
            font-weight: 600;
            color: ${({ theme }) => theme['primary-color']};
        }
    }
    .btn-proceed{
        font-size: 15px;
        font-weight: 500;
        width: 100%;
        height: 50px;
        border-radius: 8px;
        margin-top: 22px;
        @media only screen and (max-width: 575px){
            font-size: 13px;
        }
        a{
            display: flex;
            align-items: center;
        }
        i,
        svg{
            ${({ theme }) => (!theme.rtl ? 'margin-left' : 'margin-right')}: 6px;
        }
    }
`;

const MarketingCampaignStyle = Styled.div`
  @media only screen and (max-width: 1599px){
    min-height: 270px;
  }
  .ninjadash-info-element {
    img {
      max-width: 25px !important;
    }
  }
  .ant-card{
    @media only screen and (max-width: 1599px){
      min-height: 388px;
    }
    @media only screen and (max-width: 1199px){
      min-height: 100%;
    }
  }
  .ant-table-content {
    tr {
      &:first-child {
        td {
          padding-top: 0 !important;
        }
      }
      .ant-table-cell {
        padding: 7px 15px;
        @media only screen and (max-width: 1699px){
          padding: 7px 10px;
        }
      }
      td.ant-table-cell {
        &:last-child {
          ${({ theme }) => (!theme.rtl ? 'padding-right' : 'padding-left')}: 0 !important;
        }
      }
    }
    .ant-progress-inner:not(.ant-progress-circle-gradient) {
      .ant-progress-circle-path{
        stroke: ${({ theme }) => theme['primary-color']};
      }
    }
    .ant-progress-circle-trail{
      stroke: ${({ theme }) => theme['primary-color']}15;
    }
  }
`;

const ItemWraper = Styled.div`
    display: flex;
    flex-direction: column;
    .rdrDateDisplay, .rdrMonthAndYearPickers{
        display: none;
    }
    .rdrMonth {
        position: relative;
        max-width: 272px;
    }
    .rdrMonthName {
        text-align: center;
        font-size: 18px;
        position: absolute;
        top: -50px;
        ${({ theme }) => (theme.rtl ? 'right' : 'left')}: 100px;
        font-weight: 400;
    }
    .rdrDefinedRangesWrapper{
        .rdrStaticRanges{
            .rdrStaticRange{
                border-bottom: 0 none;
                &:hover,
                &.rdrStaticRangeSelected{
                    span{
                        font-weight: 400;
                        color: ${({ theme }) => theme['primary-color']};
                        background-color: #FFEAF3;
                    }
                }
                .rdrStaticRangeLabel{
                    padding: 9px 10px;
                }
            }
        }
    }
    .rdrCalendarWrapper{
        .rdrPprevButton,
        .rdrNextButton{
            padding: 0;
            background: transparent;
        }
        .rdrMonthsHorizontal{
            .rdrMonth{
                .rdrMonthName{
                    font-size: 13px;
                    font-weight: 500;
                    color: ${({ theme }) => theme['dark-color']};
                }
            }
            .rdrDays{
                .rdrSelected, 
                .rdrInRange{                    
                    background-color: #EFEFFE;
                    left: 0 !important;
                    right: 0 !important;
                }
                .rdrStartEdge{
                    right: 0 !important;
                    left: 0 !important;
                    ${({ theme }) =>
        theme.rtl
            ? 'border-top-right-radius: 1.042em; border-top-left-radius: 0em;'
            : 'border-top-left-radius: 1.042em;'};
                    ${({ theme }) =>
        theme.rtl
            ? 'border-bottom-right-radius: 1.042em;border-bottom-left-radius: 0em;'
            : 'border-bottom-left-radius: 1.042em;'};
                }
                .rdrEndEdge{
                    ${({ theme }) =>
        theme.rtl
            ? 'border-top-left-radius: 1.042em;border-top-right-radius: 0;'
            : 'border-top-right-radius: 1.042em;'};
                    ${({ theme }) =>
        theme.rtl
            ? 'border-bottom-left-radius: 1.042em;border-bottom-right-radius: 0;'
            : 'border-bottom-right-radius: 1.042em;'};
                }
                .rdrDayStartOfMonth .rdrDayInPreview, .rdrDayStartOfMonth .rdrDayEndPreview, .rdrDayStartOfWeek .rdrDayInPreview, .rdrDayStartOfWeek .rdrDayEndPreview{
                    border-radius: 0px;
                }
                
                .rdrDayEndOfWeek .rdrDayStartPreview,
                .rdrDayEndOfWeek .rdrDayInPreview,
                .rdrDayEndOfMonth .rdrDayStartPreview,
                .rdrDayEndOfMonth .rdrDayInPreview,
                .rdrDayEndOfMonth .rdrInRange, 
                .rdrDayEndOfWeek .rdrInRange, 
                .rdrDayEndOfWeek .rdrStartEdge
                .rdrDayStartOfMonth .rdrInRange, 
                .rdrDayStartOfWeek .rdrInRange{
                    border-radius: 0;
                }

                .rdrDayEndOfWeek .rdrDayStartPreview.rdrDayEndPreview,
                .rdrDayStartOfWeek .rdrDayStartPreview.rdrDayEndPreview,
                .rdrDayEndOfMonth .rdrDayStartPreview.rdrDayEndPreview,
                .rdrDayStartOfMonth .rdrDayStartPreview.rdrDayEndPreview{
                    border-radius: 1.042em;
                    color: #fff !important;
                }
                
                .rdrDayEndPreview,
                .rdrDayStartPreview,
                .rdrDayInPreview{
                    border: 0 none;
                    background-color: #EFEFFE;
                    color: ${({ theme }) => theme['dark-color']} !importtant;
                    top: 0;
                    bottom: 0;
                }
                
                .rdrStartEdge, 
                .rdrEndEdge,
                .rdrDayStartPreview,
                .rdrDayEndPreview{
                    background-color: ${({ theme }) => theme['primary-color']};
                }

                .rdrDay:not(.rdrDayPassive) .rdrInRange ~ .rdrDayNumber span,
                .rdrDay:not(.rdrDayPassive) .rdrDayInPreview ~ .rdrDayNumber span, 
                .rdrDay:not(.rdrDayPassive) .rdrSelected ~ .rdrDayNumber span{
                    color: ${({ theme }) => theme['dark-color']} !important;
                }
                .rdrDay:not(.rdrDayPassive).rdrDayHovered .rdrInRange ~ .rdrDayNumber span,
                .rdrDay:not(.rdrDayPassive).rdrDayHovered .rdrDayInPreview ~ .rdrDayNumber span, 
                .rdrDay:not(.rdrDayPassive).rdrDayHovered .rdrSelected ~ .rdrDayNumber span{
                    color: #fff !important;
                }
                .rdrDay:not(.rdrDayPassive) .rdrDayEndPreview ~ .rdrDayNumber span,
                .rdrDay:not(.rdrDayPassive) .rdrStartEdge ~ .rdrDayNumber span, 
                .rdrDay:not(.rdrDayPassive) .rdrEndEdge ~ .rdrDayNumber span{
                    color: #fff;
                }
                .rdrDay{
                    margin-bottom: 3px;
                    .rdrSelected, 
                    .rdrInRange, 
                    .rdrStartEdge, 
                    .rdrEndEdge{
                        top: 0;
                        bottom: 0;

                    }
                    .rdrDayNumber{
                        z-index: 10;
                    }
                    &.rdrDayToday{
                        background-color: ${({ theme }) => theme['primary-color']};
                        color: #fff;
                        border-radius: 50%;
                        .rdrDayNumber{
                            span{
                                color: #fff;
                                &:after{
                                    display: none;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

const ButtonGroup = Styled.div`
    border-top: 1px solid #EEEFF2;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    margin: -4px -4px -15px;
    p{
        font-size: 13px;
    margin: ${({ theme }) => (theme.rtl ? '0 0 0 20px' : '0 20px 0 0')};
        font-weight: 500;
        color: ${({ theme }) => theme['gray-color']};
    }
    button {
        font-size: 12px;
        margin: 4px;
        height: 32px;
        padding: 0px 13.26px;
    }
`;

const TaskListStyle = Styled.div`
    .ninjadash-tassklist-wrap{
        background-color: ${({ theme }) => theme[theme.mainContent]['white-background']};
        border-radius: 10px;
        min-height: 220px;
    }
    .ninjadash-tasklist-head{
        .ninjadash-tasklist-head__title{
            font-size: 16px;
            font-weight: 500;
            padding: 15px 30px;
            margin-bottom: 0;
            border-bottom: 1px solid ${({ theme }) => theme[theme.mainContent]['border-color-default']};
        }
    }
    .ninjadash-tasklist-body{
        .ninjadash-tasklist{
            .ninjadash-tasklist-item{
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 7.5px 0;
                @media only screen and (max-width: 575px){
                    flex-direction: column;
                    align-items: flex-start;
                    padding: 7.5px 0 20px;
                }
                .ninjadash-tasklist-item__content{
                    margin-right: 10px;
                }
            }
            .ninjadash-tasklist-item__title{
                font-size: 16px;
                color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                .ant-checkbox + span{
                    position: relative;
                    top: -2px;
                    ${({ theme }) => (theme.rtl ? 'padding-right' : 'padding-left')}: 10px;
                }
                .ant-checkbox-wrapper{
                    &:hover{
                        .ant-checkbox-inner{
                            border-color: ${({ theme }) => theme['success-color']};
                        }
                    }
                    span{
                        font-size: 15px;
                        font-weight: 400;
                        color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
                    }
                    .ant-checkbox-input{
                        &:focus + .ant-checkbox-inner{
                            border-color: ${({ theme }) => theme['success-color']};
                        }
                    }
                    .ant-checkbox-inner{
                        width: 18px;
                        height: 18px;
                        &:after{
                            width: 5px;
                            height: 9px;
                            top: 48%;
                            left: 25.5%;
                        }
                    }
                    .ant-checkbox-checked{
                        &:after{
                            border-color: ${({ theme }) => theme['success-color']};
                        }
                        .ant-checkbox-inner{
                            background-color: ${({ theme }) => theme['success-color']};
                            border-color: ${({ theme }) => theme['success-color']};
                            &:after{
                                border-color: #fff;
                            }
                        }
                    }
                }
            }
            .ninjadash-tasklist-item__text{
                padding-left: 30px;
                p{
                    font-size: 14px;
                    font-weight: 400;
                    color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
                    &:last-child{
                        margin-bottom: 0;
                    }
                }
            }
            .ninjadash-tasklist-item__action{
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 20px;
                @media only screen and (max-width: 575px){
                    margin-top: 20px;
                    margin-left: -10px;
                    padding-left: 30px;
                }
                svg,
                i{
                    width: 16px;
                    height: 16px;
                    color: ${({ theme }) => theme[theme.mainContent]['gray-light-text']};
                }
                .task-favourite{
                    line-height: 1;
                    &.active{
                        svg,
                        i{
                            color: ${({ theme }) => theme['warning-color']}; 
                        }
                    }
                    svg,
                    img{
                        position: relative;
                        top: -2px;
                        width: 16px;
                        height: 16px;
                    }
                }
                .ant-dropdown-trigger {
                    line-height: 1;
                }
                .task-favourite{
                    cursor: pointer;
                }
                a {
                    display: inline-flex;
                    align-items: center;
                    margin: 0 10px;
                }
                .ninjadash-edit{
                    &:hover{
                        svg,
                        i{
                            color: ${({ theme }) => theme['info-color']}; 
                        }
                    }
                }
                .ninjadash-delete{
                    &:hover{
                        svg,
                        i{
                            color: ${({ theme }) => theme['danger-color']}; 
                        } 
                    }
                }
            }
        }
        .ninjadash-tasklist-empty{
            min-height: 215px;
            display: flex;
            align-items: center;
            justify-content: center;
            span{
                font-size: 18px;
                font-weight: 500;
                color: ${({ theme }) => theme[theme.mainContent]['light-text']};
            }
        }
    }
    .ninjadash-modal-actions{
        display: flex;
        justify-content: flex-end;
        button{
            margin: 5px;
        }
    }
`;

const SocialMediaWrapper = Styled.div`
    .ant-card-body{
        padding: 12px 25px 10px !important;
    }
`;

const MainWraper = Styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 18px 0;
  h1{
    font-size: 22px;
    font-weight: 600;
    padding-top: 5px;
    margin: 0;
  }
  p{
    margin: 0;
    color: #868EAE;
  }
  .social-icon{
    span{
      font-size: 20px;
    }
  }
`;

const SocialIcon = Styled.div`
  width: 50px;
  height: 50px;
  background: ${({ bgColor }) => bgColor};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
`;

const OverviewCard = Styled.div`
    background: ${({ theme }) => theme[theme.mainContent]['white-background']};
    border-radius: 10px;
    padding: 25px 25px 20px;
    overflow: hidden;
    position: relative;
    z-index: 0;
    margin-bottom: 30px;
    ${({ theme }) => (theme.topMenu ? 'min-height: 595px' : 'min-height: auto')};
    @media only screen and (max-width: 991px){
        min-height: auto;
    }
    &:before{
        position: absolute;
        content: '';
        width: 100%;
        height: 215px;
        background:linear-gradient(45deg, ${({ theme }) => theme['secondary-color']}, ${({ theme }) =>
        theme['warning-color']});
  ${({ theme }) => (theme.rtl ? 'right' : 'left')}:0;
        top: 0;
        z-index:-1;
    }
    .overview-box{
        .ant-card-body{
            padding: 22px 25px 14px !important;
        }
        .ant-progress{
            margin-bottom: 15px;
        }
        .ant-progress-bg{
            height: 6px !important;
        }
        .overview-box-single{
            h1{
                margin-bottom: 0;
            }
            p{
                color: ${({ theme }) => theme['light-color']};
            }
        }
        .growth-downward,
        .growth-upward{
            span{
                ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: 6px;
            }
        }
        .overview-box-percentage{
            font-weight: 500;
        }
    }
    .ant-card{
        box-shadow: 0 10px 30px rgba(146,153,184,0.15);
        .growth-upward{
            color: ${({ theme }) => theme['success-color']};
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            span{
                color: ${({ theme }) => theme['light-gray-color']};
                font-weight: 400;
                font-size: 13px;
            }
        }
        .growth-downward{
            color: ${({ theme }) => theme['danger-color']};
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            span{
                color: ${({ theme }) => theme['light-gray-color']};
                font-weight: 400;
                font-size: 13px;
            }
        }
    }
    .overview-head{
        margin-bottom: 70px;
        h1{
            font-size: 16px;
            font-weight: 500;
            color: #fff;
        }
        .ant-btn-default{
            font-size: 12px;
            background: rgba(255,255,255,0.1);
            padding: 0px 11px;
            border: 0 none;
            color: #fff;
            svg,
            img,
            i{
                ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: 8px;
            }
        }
    }
`;

const ProjectHeader = Styled.div`
    margin: 20px 0 10px;
    @media (max-width: 991px){
        margin: 5px 0 5px;
    }
    @media (max-width: 767px){
        margin: 10px 0 10px;
    }
    .ant-page-header.ninjadash-page-header-main{
        padding: 18px 30px 15px;
    }
    .ant-page-header-heading{
        .ant-page-header-heading-title{
            color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
            @media only screen and (max-width: 767px){
                ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 12px;
            }
        }
    }
    .ant-page-header-heading-sub-title{
        ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 0;
        position: relative;
        ${({ theme }) => (!theme.rtl ? 'padding-left' : 'padding-right')}: 15px;
        font-weight: 500;
        &:before{
            position: absolute;
            content: '';
            width: 1px;
            height: 24px;
            background: ${({ theme }) => theme[theme.mainContent]['border-color-secondary']};
            ${({ theme }) => (!theme.rtl ? 'left' : 'right')}: 0;
            top:0;
        }
    }
`;

const ProjectSorting = Styled.div`
    margin-bottom: 25px;
    .project-sort-bar{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 0 -10px;
        @media only screen and (max-width: 1299px){
            // flex-direction: column;
            justify-content: space-between;
        }
        .project-sort-group{
            @media only screen and (max-width: 1150px){
                flex: 0 0 100%;
                display: flex;
                justify-content: center;
            }
        }
        .project-sort-nav,
        .project-sort-search,
        .project-sort-group{
            padding: 0 10px;
        }
        .project-sort-nav{
            @media only screen and (max-width: 1150px){
                margin: 0 auto;
            }
        }

        .project-sort-group{
            ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: auto;
            @media only screen and (max-width: 1299px){
                ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: 0;
            }
            @media only screen and (max-width: 1199px){
                margin: 15px 0 0;
            }
        }
        .project-sort-search{
            @media only screen and (max-width: 1299px){
                margin: 15px 0;
            }
            @media only screen and (max-width: 1199px){
                margin: 0 0 15px;
            }
            .ant-select-selection-search{
                width: 100% !important;
            }
        }
        nav{
            ul{
                li{
                    
                    a{
                        color: ${({ theme }) => theme[theme.mainContent]['gray-light-text']};
                        &:hover{
                            color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                        }
                    }
                }
            }
        }
    }
    @media (max-width: 1500px){
        .project-sort-search{
            .ant-select{
                width: 237px !important;
            }
        }
        .project-sort-group .sort-group{
            .ant-select{
                min-width: 180px;
            }
        }
    }
    @media (min-width: 1201px) and (max-width: 1300px) {
        .project-sort-search{
            .ant-select{
                width: 170px !important;
            }
        }
        .project-sort-group{
            padding: 0 5px;
            
        }
        .project-sort-group .sort-group .layout-style a{
            width: 35px;
            height: 35px;
        }
        .project-sort-group .sort-group .ant-select {
            min-width: 170px;
            ${({ theme }) => (!theme.rtl ? 'padding-left' : 'padding-right')}: 5px;
            ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 5px;
        }
    }
    @media (max-width: 1199px){
        .project-sort-search{
            flex: 0 0 100%;
            order: 0;
            margin-bottom: 25px;
            display: flex;
            justify-content: center;
            .ant-select{
                width: 350px !important;
            }
        }
        .project-sort-nav{
            order: 1;
            margin: 0 auto;
        }
        .project-sort-group{
            order: 2;
        }
    }
    @media (max-width: 991px){
        .project-sort-group{
            ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: unset;
            flex: 0 0 100%;
            margin-top: 15px;
            .sort-group{
                justify-content: flex-start;
                .layout-style{
                    ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: auto;
                }
            }
        }
    }
    @media (max-width: 575px){
        .project-sort-group{
            .sort-group{
                > span{
                    display: none;
                }
            }
        }
    }

    nav{
        background: ${({ theme }) => theme[theme.mainContent]['white-background']};
        border-radius: 5px;
        padding: 9px 20px;
        ul{
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            li{
                ${({ theme }) => (theme.rtl ? 'padding-left' : 'padding-right')}: 12px;
                ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 11px;
                ${({ theme }) => (theme.rtl ? 'border-left' : 'border-right')}: 1px solid ${({ theme }) =>
        theme[theme.mainContent]['border-color-default']};
                &:last-child{
                    ${({ theme }) => (theme.rtl ? 'padding-left' : 'padding-right')}: 0;
                    ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 0;
                    ${({ theme }) => (theme.rtl ? 'border-left' : 'border-right')}: 0 none;
                }
                a{
                    color: ${({ theme }) => theme[theme.mainContent]['gray-light-text']};
                    font-weight: 400;
                }
                &.active{
                    a{
                        color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                    }
                }
            }
        }
    }
    .ant-select-selection-search-input{
        border: 0 none;
        border-radius: 23px;
        background-color: ${({ theme }) => theme[theme.mainContent]['input-bg']};
        input{
            height: 40px !important;
            border-radius: 23px;
            background-color: ${({ theme }) => theme[theme.mainContent]['input-bg']};
        }
        .ant-input-suffix{
            svg{
                color: ${({ theme }) => theme[theme.mainContent]['gray-light-text']};
            }
        }
    }
    .ant-select-arrow{
        right: auto;
        ${({ theme }) => (theme.rtl ? 'left' : 'right')}: 11px !important;
        svg{
            color: ${({ theme }) => theme[theme.mainContent]['gray-light-text']};
        }
    }
    
    .sort-group{
        color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
        display: flex;
        align-items: center;
        justify-content: flex-end;

               
        .ant-select{
            ${({ theme }) => (!theme.rtl ? 'padding-left' : 'padding-right')}: 10px;
            ${({ theme }) => (!theme.rtl ? 'margin-left' : 'margin-right')}: 15px;
            @media only screen and (max-width: 575px){
                ${({ theme }) => (!theme.rtl ? 'padding-left' : 'padding-right')}: 0px;
                ${({ theme }) => (!theme.rtl ? 'margin-right' : 'margin-left')}: 15px;
            }
            min-width: 260px;
            .ant-select-selector{
                border: 0 none;
                background-color: ${({ theme }) => theme[theme.mainContent]['input-bg']};
                .ant-select-selection-item{                    
                    color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
                }
                
            }
        }
        .layout-style{
            display: flex;
            align-items: center;
            ${({ theme }) => (theme.rtl ? 'margin-right' : 'margin-left')}: 20px;
            a{
                display: flex;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                align-items: center;
                justify-content: center;
                color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
                &:hover,
                &.active{
                    color: ${({ theme }) => theme[theme.mainContent]['menu-active']};
                    background: ${({ theme }) => theme[theme.mainContent]['white-background']};
                }
                svg{
                    width: 16px;
                    height: 16px;
                }
            }
        }
    }
    @media (max-width: 400px){
        .sort-group .ant-select{
            min-width: 200px;
        }
        .project-sort-search{
            .ant-select-auto-complete{
                width: 100% !important;
            }
        }
        .project-sort-nav{
            nav{
                padding: 10px;
            }
            nav ul{
                flex-wrap: wrap;
                justify-content: center;
                margin-bottom: -5px;
                li{
                    ${({ theme }) => (theme.rtl ? 'border-left' : 'border-right')}: 0 none;
                    margin-bottom: 5px;
                }
            }
        }
    }
`;

const ProjectPagination = Styled.div`
    .ant-pagination{
        display: flex;
        justify-content: flex-end;
        @media only screen and (max-width: 767px) {
            justify-content: center;
        }
    }
`;

const ProjectListTitle = Styled.div`
    h1{
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 5px;
        a{
            color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
        }
    }
    p{
        margin: 0;
        font-size: 12px;
        color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
    }
`;

const ProjectList = Styled.div`

    .project-list-progress{
        p{
            margin: 4px 0 0 0;
            font-size: 13px;
            color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
        }
    }
    .date-started,
    .date-finished{
        font-weight: 500;
    }
    .ant-table{
        background-color: ${({ theme }) => theme[theme.mainContent]['white-background']};
        .ant-table-thead{
            tr{
                th{
                    color: ${({ theme }) => theme[theme.mainContent]['gray-light-text']};
                    background-color: ${({ theme }) => theme[theme.mainContent]['main-background-light']};
                    border-bottom-color: ${({ theme }) => theme[theme.mainContent]['border-color-default']};
                }
            }
        }
        .ant-table-tbody{
            tr{
                &:hover{
                    td{
                        background-color: ${({ theme }) => theme[theme.mainContent]['white-background']};
                    }
                }
                .ant-tag{
                    &.progress{
                        background-color: #FF4D4F;
                    }
                    &.late{
                        background-color: ${({ theme }) => theme['warning-color']};
                    }
                    &.complete{
                        background-color: ${({ theme }) => theme['success-color']};
                    }
                }
                td{
                    color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
                    border-bottom-color: ${({ theme }) => theme[theme.mainContent]['border-color-default']};
                }
            }
            .ant-progress{
                &.ant-progress-status-success{
                    .ant-progress-text{
                        svg{
                           color: ${({ theme }) => theme['success-color']};
                        }
                    }
                }
            }
            .ant-dropdown-trigger {
                svg{
                    width: 16px;
                    height: 16px;
                }
            }
        }
    }
    .ant-table-container table > thead > tr th{
        font-weight: 400;
        color: ${({ theme }) => theme[theme.mainContent]['light-text']};
        border-top: 1px solid ${({ theme }) => theme[theme.mainContent]['border-color-default']};
    }
    .ant-table-container table > thead > tr th:first-child{
        border-radius: ${({ theme }) => (theme.rtl ? '0 10px 10px 0' : '10px 0 0 10px')} !important;
        ${({ theme }) => (!theme.rtl ? 'border-left' : 'border-right')}: 1px solid ${({ theme }) =>
        theme[theme.mainContent]['border-color-default']};
    }
    .ant-table-container table > thead > tr th:last-child{
        border-radius: ${({ theme }) => (!theme.rtl ? '0 10px 10px 0' : '10px 0 0 10px')} !important;
        ${({ theme }) => (theme.rtl ? 'border-left' : 'border-right')}: 1px solid ${({ theme }) =>
        theme[theme.mainContent]['border-color-default']};
    }
    .ant-dropdown-trigger{
        svg{
            color: ${({ theme }) => theme[theme.mainContent]['extra-light-text']};
        }
    }
`;

const ProjectCard = Styled.div`
    .ant-card-body{
        padding: 0px !important;
    }
    .project-top{
        padding:30px 30px 0px;
    }
    .project-bottom{
        .project-assignees{
            padding: 16px 30px 25px;
        }
    }
    .project-title{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        h1{
            font-size: 16px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin: -2px;
            a{
                color: ${({ theme }) => theme[theme.mainContent]['dark-text']};
                ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 11px !important;
            }
            a,
            .ant-tag{
                margin: 2px;
            }
            .ant-tag{
                text-transform: uppercase;
                font-size: 10px;
                ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 0;
                line-height: 18px;
                background: red;
                color: #fff;
                border: 0 none;
                &.early{
                    background: ${({ theme }) => theme['primary-color']};
                }
                &.progress{
                    background: #FF4D4F;
                }
                &.late{
                    background: ${({ theme }) => theme['warning-color']};
                }
                &.complete{
                    background: ${({ theme }) => theme['success-color']};
                }
            }
        }
        .ant-dropdown-trigger{
            color: ${({ theme }) => theme[theme.mainContent]['extra-light-text']};
            svg{
                color: ${({ theme }) => theme[theme.mainContent]['extra-light-text']};
            }
        }
    }
    .project-desc{
        margin: 7px 0 25px 0;
        color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
    }
    .project-timing{
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        div{
            ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 30px;
            &:last-child{
                ${({ theme }) => (theme.rtl ? 'margin-left' : 'margin-right')}: 0;
            }
            span, strong{
                display: block;
            }
            span{
                font-size: 12px;
                margin-bottom: 2px;
                color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
            }
            strong{
                font-weight: 500;
                color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
            }
        }
    }
    .project-progress{
        p{
            margin: 2px 0 0 0;
            color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
            font-size: 12px;
        }
        .ant-progress-text{
            font-size: 12px;
            font-weight: 500;
        }
    }
    .ant-progress{
        &.ant-progress-status-success{
            .ant-progress-text{
                svg{
                    color: ${({ theme }) => theme['success-color']};
                }
            }
        }
    }
    .project-assignees{
        border-top: 1px solid ${({ theme }) => theme[theme.mainContent]['border-color-default']};
        margin-top: 17px;
        padding-top: 16px;
        p{
            font-size: 14px;
            color: ${({ theme }) => theme[theme.mainContent]['gray-text']};
        }
        ul{
            margin: -3px;
            padding: 0;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            li{
                list-style: none;
                padding: 3px;
                img{
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    object-fit: cover;
                }
            }
        }
    }
`;

const StepsStyle = Styled(Steps)`
    .anticon {
        &.anticon-check {
            &.ant-steps-finish-icon{
                svg{
                    color: ${({ theme }) => theme['primary-color']};
                }
            }
        }
        &.ant-steps-error-icon{
            svg{
                    color: ${({ theme }) => theme['danger-color']};
                }
        }
    }
    .steps-action{
        margin-top: 40px;
        button{
            height: 44px;
        }
    }
`;

const ActionWrapper = Styled.div`
    width: 100%;
    .step-action-wrap{
        display: flex;
        justify-content: center;
        .step-action-inner{
            width: 580px;
            padding: 0 25px;
            @media only screen and (max-width: 575px){
                width: 100%;
                padding: 0;
            }
        }
    }
    .steps-action{
        margin-top: 38px;
        width: 100%;
        float: right;
        display: flex;
        justify-content: space-between;
        @media only screen and (max-width: 991px){
            margin-top: 25px;
        }
        @media only screen and (max-width: 379px){
            flex-flow: column;
        }
        button{
            display: flex;
            align-items: center;
            height: 44px;
            padding: 0 20px;
            @media only screen and (max-width: 379px){
                justify-content: center;
            }
            &.ant-btn-light{
                color: ${({ theme }) => theme[theme.mainContent]['gray-light-text']};
                border: 1px solid ${({ theme }) => theme[theme.mainContent]['border-color-default']};
            }
            &.btn-next{
                svg{
                    margin-left: 10px;
                }
            }
            &.btn-prev{
                svg{
                    margin-right: 10px;
                }
            }
        }
        button + button {
            @media only screen and (max-width: 379px){
                margin-top: 15px;
            }
        }
    }
`;

export {
    ProjectList,
    ProjectListTitle,
    ActionWrapper,
    StepsStyle,
    ProjectCard,
    ProjectPagination,
    ProjectHeader,
    ProjectSorting,
    OverviewCard,
    MainWraper,
    SocialIcon,
    SocialMediaWrapper,
    TaskListStyle,
    ItemWraper,
    ButtonGroup,
    MarketingCampaignStyle,
    OrderSummary,
    BrowserStateWrap,
    TopSellerWrap,
    SaleLocationMap,
    LocationTableWrap,
    CardBarChart,
    SalesRevenueWrapper,
    ChartContainer,
    OverviewCardWrap,
    NavTitle,
    FooterStyle,
    LayoutContainer,
    SmallScreenAuthInfo,
    SmallScreenSearch,
    ModeSwitch,
    TopMenuStyle,
    TopMenuSearch,
    OverviewDataStyleWrap,
    MixedCardWrap,
    NewsletterStyle,
};
